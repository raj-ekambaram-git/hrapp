// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../../constants";
import { util } from "../../../../helpers/util";
import prisma from "../../../../lib/prisma";
import { emailService } from "../../../../services";
const bcrypt = require('bcryptjs');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    console.log("API CREATE::"+JSON.stringify(user))
    //get Salt for passowrd
    if(user.password != undefined) {
      const tempPassword = util.getTempPassword();
      const passwordHash = util.getPasswordHash(tempPassword);
      user.passwordSalt = passwordHash.passwordSalt;
      user.password = passwordHash.passwordHash;
      user.passwordExpired = true
      user.passwordRetries = 5

      console.log("passwordHash:::"+passwordHash);

      const savedUser = await prisma.user.create({
        data: user,
        include: {
          account: {
            select: {
              name: true
            },            
          },
          vendorUsers: {
            select: {
              vendor:{
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if(savedUser) {
        const newSavedUserForEmail = {...savedUser}
        newSavedUserForEmail["tempPassword"] = tempPassword
        const emailResponse = emailService.sendEmail(getNewUserEmailRequest(newSavedUserForEmail));
      }

      res.status(200).json(savedUser);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while saving account' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}


function getNewUserEmailRequest(savedUser) {
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: savedUser.email,
    templateData: savedUser,
    template_id: EmailConstants.emailTemplate.newUserCreated
  }

}