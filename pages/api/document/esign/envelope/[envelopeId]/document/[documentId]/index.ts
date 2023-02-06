import { NextApiRequest, NextApiResponse } from "next";
const docusign = require('docusign-esign');
import { EMPTY_STRING } from "../../../../../../../../constants";
import { authenticate } from "../../../../../../../../helpers/api/eSignatureUtil";


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
    const documentId = req.query?.documentId;
    console.log("accountId::"+accountId+"******Enveelope ID::"+envelopeId+"****documentId::"+documentId)
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

      let envelopeDocuments = await envelopesApi.listDocuments(
        accountInfo.apiAccountId,
        envelopeId,
        null
      );

      let docItem = envelopeDocuments.envelopeDocuments.find(
        (item) => item.documentId === documentId
      ),
      docName = docItem.name,
      hasPDFsuffix = docName.substr(docName.length - 4).toUpperCase() === ".PDF",
      pdfFile = hasPDFsuffix;
    // Add .pdf if it's a content or summary doc and doesn't already end in .pdf
    if (
      (docItem.type === "content" || docItem.type === "summary") &&
      !hasPDFsuffix
    ) {
      docName += ".pdf";
      pdfFile = true;
    }
    if (docItem.type === 'portfolio') {
      docName += ".pdf";
      pdfFile = true;
    }
    // Add .zip as appropriate
    if (docItem.type === "zip") {
      docName += ".zip";
    }
  
    // Return the file information
    // See https://stackoverflow.com/a/30625085/64904
    let mimetype;
    if (pdfFile) {
      mimetype = "application/pdf";
    } else if (docItem.type === "zip") {
      mimetype = "application/zip";
    } else {
      mimetype = "application/octet-stream";
    }
  
    // return { mimetype: mimetype, docName: docName, fileBytes: results };

      // console.log("responseData::"+JSON.stringify(document))
      res.status(200).json({ mimetype: mimetype, docName: docName, fileBytes: document })

    }else {
      res.status(400).json({ message: "Error authenticating eSignature, please try again later or contact administrator." });
    }
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};


