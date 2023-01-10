// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { invoiceService } from "../../services";
import fs from 'fs';
import { Buffer, Blob } from "buffer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mail = require('@sendgrid/mail');
  mail.setApiKey(process.env.SG_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {emailRequest} = req.body;
      if(emailRequest && !emailRequest.withAttachment) {
        await mail.send({
          from: {
            email: emailRequest.from
          },
          personalizations: [
            {
              to: emailRequest.to,
              dynamic_template_data: emailRequest.templateData,
            }
          ],
          template_id: emailRequest.template_id
        }).then((emailResponse) => {
          console.log("emailResponse::"+JSON.stringify(emailResponse))
          res.status(200).json(emailRequest);
        })
        .catch(err => {
          console.log("Error sending reset password"+err)
          return {errorMessage: err, error: true};
        });
      }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
