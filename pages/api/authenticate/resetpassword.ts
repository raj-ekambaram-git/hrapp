// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";
import {util} from '../../../helpers/util';
import { emailService } from "../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    if(user.email != undefined ) {
      //Generate Password 
      const tempPassword = util.getTempPassword();

      console.log("tempPassword::::"+tempPassword);
      const passwordHash = util.getPasswordHash(tempPassword);

      const savedUser = await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {password: passwordHash.passwordHash, passwordSalt: passwordHash.passwordSalt, passwordExpired: true, passwordRetries: 5} //TODO: Get the starting password retries from Config
      });
  
      if(savedUser) {
        //Send Reset Password Email now
        const emailResponse = emailService.sendEmail(getTempPasswordEmailRequest(savedUser, tempPassword));
        console.log("Email Response :::"+emailResponse)
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
    from: "admin@dsquaretech.us",
    to: resetUser.email,
    templateData: {
      tempPassword: tempPassword
    },
    template_id: 'd-fe0e6d3b03a846fd957bb052a2d343e3'
  }

}