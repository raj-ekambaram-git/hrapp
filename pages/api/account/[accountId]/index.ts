// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../../constants";
import prisma from "../../../../lib/prisma";
import { emailService } from "../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const account = req.body;
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedAccount = await prisma.account.update({
      where: {
        id: account.id,
      },
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

    if(savedAccount && process.env.ENABLE_EMAIL === "Yes") {
      const emailResponse = emailService.sendEmail(getNewAccountEmailRequest(savedAccount));
    }

    res.status(200).json(savedAccount);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}

function getNewAccountEmailRequest(savedAccount) {
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: savedAccount.email,
    cc: savedAccount?.updatedBy?.email,
    templateData: savedAccount,
    template_id: EmailConstants.emailTemplate.updateAccountTemplateId
  }

}