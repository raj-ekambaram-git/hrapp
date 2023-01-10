// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mail = require('@sendgrid/mail');
  mail.setApiKey(process.env.SG_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const emailRequest = req.body;

    console.log("emailRequest:::"+JSON.stringify(emailRequest))

    //Successfully saved the temp password, now send the email
      if(emailRequest) {
        await mail.send({
          to: 'raj.ekambaram@yahoo.com',
          from: 'admin@dsquaredtech.us',
          subject: 'New Message!',
          text: 'Text Message',
          html: 'Test Message with temp password :'+emailRequest.body,
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
