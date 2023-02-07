import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
const docusign = require('docusign-esign');
const fs = require('fs');
import axios from "axios";
import prisma from "../../../../lib/prisma";
import { DocumentCategory, DocumentStatus } from "@prisma/client";
import {authenticate, populateTabsData} from '../../../../helpers/api/eSignatureUtil'

const s3 = new S3({
  region: process.env.ACCESS_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const SCOPES = [
    "signature"
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("req.body::"+JSON.stringify(req.body))
    let {eSignSendRequest} = req.body;

    const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: eSignSendRequest.templatePath,
        Expires: parseInt(process.env.DOCUMENT_VIEW_EXPIRATION), // seconds
      }

    const viewFile = await s3.getSignedUrlPromise("getObject",fileParams)

    let accountInfo = await authenticate(SCOPES)
    console.log("accountInfo:::"+JSON.stringify(accountInfo))
    if(accountInfo.accessToken) {
      const fileType = eSignSendRequest.templatePath.split(".")[1]
      const envelopeArgs = {
          signerEmail: eSignSendRequest.esignDetails.recepientEmail,
          ccEmail: eSignSendRequest.esignDetails.ccEmail,
          configData: eSignSendRequest.esignDetails.configData,
          status: "sent",
          documentName: eSignSendRequest.documentName,
          documentURL: viewFile,
          documentFileType: fileType,
          emailSubject:  eSignSendRequest.esignDetails.emailSubject
        };
        const args = {
          accessToken: accountInfo.accessToken,
          basePath: accountInfo.basePath,
          accountId: accountInfo.apiAccountId,
          envelopeArgs: envelopeArgs
        };
  
        const esignSendResult = await sendEnvelope(args)
        console.log("esignSendResult::"+JSON.stringify(esignSendResult))
      
        if(esignSendResult.status == "sent") {
  
          const savedDocuemnt = await prisma.document.create({
            data: {
              type: eSignSendRequest.type,
              typeId: eSignSendRequest.typeId,
              createdBy: eSignSendRequest.createdBy,
              name: eSignSendRequest.documentName,
              status: DocumentStatus.Active,
              urlPath: esignSendResult.envelopeId,
              category: DocumentCategory.Signature,
              configData: eSignSendRequest.esignDetails.configData
            },
            include: {
              createdUser: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          });
          res.status(200).json(savedDocuemnt)
        }else {
          res.status(400).json({ message: "Not able to send the eSignature request, please try again later or contact administrator." });
        }  
    }else {
      res.status(400).json({ message: "Error authenticating eSignature, please try again later or contact administrator." });
    }

    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};



  /**
 * This function does the work of creating the envelope
 */
const sendEnvelope = async (args) => {
  
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
    let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
      results = null;
  
    const response = await axios.get(args.envelopeArgs.documentURL, {
      responseType: "arraybuffer",
    });
    // Step 1. Make the envelope request body
    let envelope = makeEnvelope(args.envelopeArgs, Buffer.from(response.data).toString("base64"));
  
    // Step 2. call Envelopes::create API method
    // Exceptions will be caught by the calling function
    results = await envelopesApi.createEnvelope(args.accountId, {
      envelopeDefinition: envelope,
    });
    let envelopeId = results.envelopeId;
  
    console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
    return results;
  };

  /**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope
 * @returns {Envelope} An envelope definition
 * @private
 */
   function makeEnvelope(args, arrayBuffer) {
    console.log("args:::"+JSON.stringify(args))
    // create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = args.emailSubject;
  
    // add the documents
    // const response = await axios.get(args.documentURL, {
    //   responseType: "arraybuffer",
    // });
    let doc1 = new docusign.Document(),
    doc1b64 = arrayBuffer;
    doc1.documentBase64 = doc1b64;
    doc1.name = args.documentName; // can be different from actual file name
    doc1.fileExtension = args.documentFileType; // Source data format. Signed docs are always pdf.
    doc1.documentId = "1"; // a label used to reference the doc

  

    // The order in the docs array determines the order in the envelope
    env.documents = [doc1];
  
    // create a signer recipient to sign the document, identified by name and email
    // We're setting the parameters via the object constructor


    let signerEmailArray = [];
    let indexVal = 0;
    args.signerEmail?.map((signer, index) => {
        let signerObj = docusign.Signer.constructFromObject({
        email: signer.email,
        name: signer.name,
        recipientId: indexVal+1,
        routingOrder: indexVal+1,
        });
        signerObj.tab = populateTabsData(docusign, args.configData)
        //Get Tabs Data for Signer 
        
      //   let signHere1 = docusign.SignHere.constructFromObject({
      //     anchorString: "**signature_1**",
      //     anchorYOffset: "10",
      //     anchorUnits: "pixels",
      //     anchorXOffset: "20",
      //   });
      // // Tabs are set per recipient / signer
      // let signer1Tabs = docusign.Tabs.constructFromObject({
      //   signHereTabs: [signHere1],
      // });
      // signerObj.tabs = signer1Tabs;

        indexVal++
        signerEmailArray.push(signerObj)
    })
    // routingOrder (lower means earlier) determines the order of deliveries
    // to the recipients. Parallel routing order is supported by using the
    // same integer as the order for two or more recipients.
  
    // create a cc recipient to receive a copy of the documents, identified by name and email
    // We're setting the parameters via setters
    let ccEmailArray = [];    
    args.ccEmail?.map((cc) => {
        let cc1 = new docusign.CarbonCopy();
        cc1.email = cc.email;
        cc1.name = cc.name;
        cc1.routingOrder = indexVal+1;
        cc1.recipientId = indexVal+1;
        ccEmailArray.push(cc1)
        indexVal++
    })

    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
      signers: signerEmailArray,
      carbonCopies: ccEmailArray,
    });
    env.recipients = recipients;
  
    // Request that the envelope be sent by setting |status| to "sent".
    // To request that the envelope be created as a draft, set to "created"
    env.status = args.status;
  
    return env;
  }
  
