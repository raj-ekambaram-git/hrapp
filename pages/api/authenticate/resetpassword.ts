// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";
import {util} from '../../../helpers/util';

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
  
      res.status(200).json(savedUser);
    
  
    }else {
      res.status(400).json({ message: 'Something went wrong while changing password' })
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}


async function hasAccess(result, res, userId, newPassword) {
  if (result) {
    // insert login code here
    console.log("Access Granted! ::"+userId);

    //Old Password is correct, so create the new password and update the user record
    const hashed = util.getPasswordHash(newPassword);

    console.log("hashed:::"+JSON.stringify(hashed));

    const savedUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {password: hashed.passwordHash, passwordSalt: hashed.passwordSalt}
    });

    res.status(200).json(savedUser);
  }
  else {
    // insert access denied code here
    console.log("Access Denied! ::"+userId);
    res.status(400).json({ message: 'Invalid old password. Please enter valid old password to change it.' });
  }
}