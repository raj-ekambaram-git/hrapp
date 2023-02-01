// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../constants";
import prisma from "../../../lib/prisma";
import { emailService, userService } from "../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const account = req.body;
    
    const savedAccount = await prisma.account.create({
      data: account,
      include: {
        address: true,
        updatedBy: {
          select: {
            email: true
          }
        }
      }
    });
    if(savedAccount) {
      const emailResponse = emailService.sendEmail(getNewAccountEmailRequest(savedAccount));
    }
    res.status(200).json(savedAccount);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}


function getNewAccountEmailRequest(savedAccount) {
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: savedAccount.email,
    cc: savedAccount.updatedBy?.email,
    templateData: savedAccount,
    template_id: EmailConstants.emailTemplate.newAccountTemplateId
  }

}