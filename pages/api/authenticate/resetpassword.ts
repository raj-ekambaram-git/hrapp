// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";
import {util} from '../../../helpers/util';
import { emailService } from "../../../services";
import { CommonConstants, EmailConstants } from "../../../constants";
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    if(user.email != undefined ) {
      //Generate Password 
      const tempPassword = util.getTempPassword();
      const passwordHash = util.getPasswordHash(tempPassword);

      const passwordToken = jwt.sign({ sub: tempPassword}, serverRuntimeConfig.secret, { expiresIn: '30m' }); // TODO: Expiration dates from Config Values

      const savedUser = await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {password: passwordHash.passwordHash, passwordSalt: passwordHash.passwordSalt, passwordExpired: true, passwordRetries: 5} //TODO: Get the starting password retries from Config
      });
  
      if(savedUser) {
        //Send Reset Password Email now
        const emailResponse = emailService.sendEmail(getTempPasswordEmailRequest(savedUser, req.headers.referer.split("login")[0]+"changepassword?userId="+savedUser.id+"&maskedTempPassword="+passwordToken));
      }
      res.status(200).json(savedUser);
    
  
    }else {
      res.status(400).json({ message: 'Something went wrong while changing password' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}



function getTempPasswordEmailRequest(resetUser, tempPassword) {
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: resetUser.email,
    templateData: {
      tempPassword: tempPassword
    },
    template_id: EmailConstants.emailTemplate.resetPasswordTemplateId
  }

}