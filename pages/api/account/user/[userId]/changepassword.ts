// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
const bcrypt = require('bcryptjs');
import prisma from "../../../../../lib/prisma";
import {util} from '../../../../../helpers/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    if(user.newPassword != undefined && user.oldPassword != undefined && user.userId != undefined) {
      //Get the acutal user and check if the old password is correct or else throw error
      const userRecord = await prisma.user.findUnique({
        where: {
          id: parseInt(user.userId),
        }
      });

      if(userRecord != undefined) {
        bcrypt.compare(user.oldPassword, userRecord.password, function(err, result) {  // Compare
          // if passwords match
          if (result) {
                console.log("It matches!")
                hasAccess(true, res, user.userId, user.newPassword);
          }
          // if passwords do not match
          else {
                console.log("Invalid password!");
                hasAccess(false, res, user.userId, user.newPassword);
          }
        });
      }else {
        res.status(400).json({ message: 'Something went wrong while changing password' })
      }
  
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
        id: userId,
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