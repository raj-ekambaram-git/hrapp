import { NextApiRequest, NextApiResponse } from "next";
const docusign = require('docusign-esign');
import { EMPTY_STRING } from "../../../../../../../../constants";
import { authenticate } from "../../../../../../../../helpers/api/eSignatureUtil";
import S3 from "aws-sdk/clients/s3";
var fs = require('fs');
var path = require('path');
import {fetchWrapper} from '../../../../../../../../helpers'

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
    
    const accountId = req.query?.accountId;
    const envelopeId = req.query?.envelopeId;
    const documentId = req.query?.documentId;
    const {docMetaData} = req.body;

    console.log("accountId::"+accountId+"******Enveelope ID::"+envelopeId+"****documentId::"+documentId+"*****docMetaData::"+JSON.stringify(docMetaData))
    const accountInfo = await authenticate(SCOPES)

    console.log("accountInfo::"+JSON.stringify(accountInfo))

    if(accountInfo.accessToken && envelopeId && envelopeId != EMPTY_STRING && documentId && documentId != EMPTY_STRING) {
      const responseData = {};

      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(accountInfo.basePath);
      dsApiClient.addDefaultHeader("Authorization", "Bearer " + accountInfo.accessToken);  
      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      const document = await envelopesApi.getDocument(
        accountInfo.apiAccountId,
        envelopeId,
        documentId,
        null
      );

      // download the document pdf
      var filename = accountId + '_' + envelopeId + '_' + documentId +"."+ docMetaData.fileExtension;
      // var tempFile = path.resolve( "tempFiles", filename);
      // fs.writeFile(tempFile, new Buffer(document, 'binary'), function (err) {
      //   if (err) console.log('Error: ' + err);
      // });
      // console.log('Document ' + documentId + ' from envelope ' + envelopeId + ' has been downloaded to ' + tempFile);

      //Now get the S3 URL for this file
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: "temp/"+filename,
        ContentType: docMetaData.mimetype,
        Expires: parseInt(process.env.DOCUMENT_VIEW_EXPIRATION), // seconds
      }

      const uploadedFile = await s3.getSignedUrlPromise("putObject",fileParams)
      const fileReturn = await fetchWrapper.filePut(uploadedFile, new Buffer(document, 'binary'), docMetaData.mimetype)
      delete fileParams["ContentType"]
      const viewFile = await s3.getSignedUrlPromise("getObject",fileParams)
      res.status(200).json(viewFile)

    }else {
      res.status(400).json({ message: "Error authenticating eSignature, please try again later or contact administrator." });
    }
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};


