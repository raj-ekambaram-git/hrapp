// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
import getConfig from 'next/config';
import { fetchWrapper } from "../../../../../helpers";
import { CommonConstants, EmailConstants, EMPTY_STRING } from "../../../../../constants";
import { emailService } from "../../../../../services";
const { serverRuntimeConfig } = getConfig();
const serverBaseUrl = `${serverRuntimeConfig.apiUrl}`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoiceId = req.query?.invoiceId;
    const accountId = req.query?.accountId;
    const authHeader = {Authorization: req.headers.authorization}

    if(invoiceId && accountId) {

      const responseData = await fetchWrapper.getWithAuth(`${serverBaseUrl}/account/invoice/`+invoiceId+'/generate/detail?accountId='+accountId, {},authHeader)
      .then(async generateInvoiceDetail => {

        if(generateInvoiceDetail.invoiceEmailTo != undefined && generateInvoiceDetail.invoiceEmailTo != null && generateInvoiceDetail.invoiceEmailTo != EMPTY_STRING) {
            const sendEmailTo = generateInvoiceDetail.invoiceEmailTo;
            const emailTos = sendEmailTo.map((emailTo) => {
              return {
                "email": emailTo
              }
            });

          
            const bufferResponse = await fetch(`${serverBaseUrl}/account/invoice/${invoiceId}/generate`, {
              method: 'POST',
              body: JSON.stringify(generateInvoiceDetail),
              headers: { 'Content-Type': 'application/json', ...authHeader},
            }).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error, status = ${response.status}`);
              }
              return response.arrayBuffer();
            });
            
            if(bufferResponse) {
              const buffer = Buffer.from(bufferResponse)
              const utf8str = buffer.toString('base64')
              
              const emailResponse = await emailService.sendEmail({
                withAttachment: true,
                from: CommonConstants.fromEmail,
                to: emailTos,
                templateData: generateInvoiceDetail,
                template_id: EmailConstants.emailTemplate.invoiceTemplateId,
                subject: "Invoice: "+generateInvoiceDetail.id+" created",
                attachments: [
                  {
                    content: utf8str,
                    filename: "Invoice_File_"+generateInvoiceDetail.id+".pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                  }
                ]
              }, authHeader);

              return {message: "Successfully sent email to: "+JSON.stringify(sendEmailTo), error: false};
            } else {
              return {errorMessage: "Error generateInvoice", error: true};
            }         
            
          } else {
            console.log("NO emials to send")
            return {errorMessage: "Error Sending invoice email.", error: true};
          }

      })
      .catch(err => {
        console.log("Error generateInvoice::"+err)
        return {errorMessage: err, error: true};
      });

      console.log("responseData:::"+JSON.stringify(responseData))
      res.status(200).json(responseData)
  
    } else {
      res.status(400).json({ message: 'Something went wrong while sending invoice reminder.' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}

