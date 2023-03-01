// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../constants";
import { ErrorMessage } from "../../../constants/errorMessage";
import { util } from "../../../helpers/util";
import prisma from "../../../lib/prisma";
import { emailService, userService } from "../../../services";
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const account = req.body;
    
    //Handle Password here
    if(account.user && account.user?.create && account.user?.create.length >0) {

      const createUserData = account.user?.create.map((usr) => {
        const passwordHash = util.getPasswordHash(usr.password);
        usr.password = passwordHash.passwordHash
        usr.passwordSalt = passwordHash.passwordSalt
        return usr
      })
    }

    const savedAccount = await prisma.account.create({
      data: account,
      include: {
        address: true,
        updatedBy: {
          select: {
            email: true,
            userRole: true
          }
        }
      }
    });

    if(savedAccount) {
      const newSavedAccountForEmail = {...savedAccount}
      newSavedAccountForEmail["tempPassword"] = ""

      const authToken = jwt.sign({ sub: savedAccount.updatedBy?.email+":"+savedAccount.id+":"+serverRuntimeConfig.clientId+":"+savedAccount.updatedBy?.userRole}, serverRuntimeConfig.secret, { expiresIn: '1d' }); // TODO: Expiration dates from Config Values

      const authHeader = {Authorization: authToken}
      const emailResponse = emailService.sendEmail(getNewAccountEmailRequest(newSavedAccountForEmail), authHeader);
    }
    res.status(200).json(savedAccount);
  } catch (error) {
    console.log("error:::"+JSON.stringify(error))
    if(error.code === "P2002" && error?.meta?.target && error?.meta?.target[0] === "email") {
      res.status(400).json({ message: ErrorMessage.USER_ALREADY_EXISTS })  
    }else {
      res.status(400).json({ message: 'Something went wrong while saving account' })
    }
    
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