import { NextApiRequest, NextApiResponse } from "next";
const docusign = require('docusign-esign');
import {authenticate} from '../../../../../../helpers/api/eSignatureUtil'
import { EMPTY_STRING } from "../../../../../../constants";

const SCOPES = [
    "signature"
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    
    const accountId = req.query?.accountId;
    const envelopeId = req.query?.envelopeId;
    console.log("accountId::"+accountId+"******Enveelope ID::"+envelopeId)
    const accountInfo = await authenticate(SCOPES)

    if(accountInfo.accessToken && envelopeId && envelopeId != EMPTY_STRING) {
      const responseData = {};

      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(accountInfo.basePath);
      dsApiClient.addDefaultHeader("Authorization", "Bearer " + accountInfo.accessToken);  
      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      const evenlopeStatus = await envelopesApi.getEnvelope(
        accountInfo.apiAccountId,
        envelopeId,
        null
      );

      if(evenlopeStatus) {
        responseData["statusData"] = {
          status: evenlopeStatus.status,
          emailSubject: evenlopeStatus.emailSubject
        }
      }

      const recepients = await envelopesApi.listRecipients(
        accountInfo.apiAccountId,
        envelopeId,
        null
      );
      if(recepients) {
        responseData["recepients"] = {
          cc: recepients.carbonCopies,
          signers: recepients.signers
        }
      }

      let envelopeDocuments = await envelopesApi.listDocuments(
        accountInfo.apiAccountId,
        envelopeId,
        null
      );

      if(envelopeDocuments) {
        responseData["envelopeDocuments"] = {
          envelopeDocuments: envelopeDocuments.envelopeDocuments
        }
      }
      
      res.status(200).json(responseData)

    }else {
      res.status(400).json({ message: "Error authenticating eSignature, please try again later or contact administrator." });
    }
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};


