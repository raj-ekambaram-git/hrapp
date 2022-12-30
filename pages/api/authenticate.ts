const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../lib/prisma";



const { serverRuntimeConfig } = getConfig();



// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const loginData = req.body;
    console.log("LOGINNN:::"+JSON.stringify(loginData))
    
    const user = await prisma.user.findUnique({
      where: {
        email: loginData.username,
      }
    });

    console.log("USER RESPONSE :::"+JSON.stringify(user))

    if(user != undefined) {
      //check if the password matches
        bcrypt.compare(loginData.password, user.password, function(err, result) {  // Compare
          // if passwords match
          if (result) {
                console.log("It matches!")
                hasAccess(true, res, user);
          }
          // if passwords do not match
          else {
                console.log("Invalid password!");
                hasAccess(false, res, user);
          }
        });
      

    }else {
      res.status(400).json({ message: 'User not found.' });
    }

    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' });
  }
}


function hasAccess(result, res, user) {
  if (result) {
    // insert login code here
    console.log("Access Granted!");
    // // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.email }, serverRuntimeConfig.secret, { expiresIn: '7d' });
    // return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accountId: user.accountId,
        token
    });
  }
  else {
    // insert access denied code here
    console.log("Access Denied!");
    res.status(400).json({ message: 'Invalid credentials. Please try again or reset password.' });
  }
}