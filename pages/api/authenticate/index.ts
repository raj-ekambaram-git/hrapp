const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";
import { AccountFeatureStatus, AccountStatus, FeatureStatus, UserStatus } from '@prisma/client';
import { ErrorMessage } from '../../../constants/errorMessage';



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
      },
      include: {
        account: {
          select: {
            status: true
          }
        }
      }
    });

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


async function hasAccess(result, res, user) {
  if (result) {
    // insert login code here
    console.log("Access Granted!");
    if(user.status != UserStatus.Active && user.status != UserStatus.Approved) {
      res.status(400).json({ message: ErrorMessage.USER_NOT_ACTIVE });
    }

    if(user.account?.status != AccountStatus.Active && user.account?.status != AccountStatus.Approved) {
      res.status(400).json({ message: ErrorMessage.ACCOUNT_NOT_ACTIVE });
    }
    //Update the last sign in time stamp
    const savedUser = await prisma.user.update({
      where: {
        id: parseInt(user.id),
      },
      data: {passwordRetries: 5, lastSignIn: new Date()}, // TODO: Get the Password retires from config value,
      select: {
        account: {
          select: {            
            accoutFeatures: {
              where: {
                status: {
                  equals: AccountFeatureStatus.Active
                },
                feature: {
                  status: {
                    equals: FeatureStatus.Active
                  },
                }
              },
              select: {
                feature: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
    console.log("LOGGED ION USERRR ::"+JSON.stringify(savedUser))

    // // create a jwt token that is valid for 7 days
    const authToken = jwt.sign({ sub: user.email+":"+user.accountId+":"+serverRuntimeConfig.clientId+":"+user.userRole}, serverRuntimeConfig.secret, { expiresIn: '1d' }); // TODO: Expiration dates from Config Values
    const accountToken = jwt.sign({ sub: user.accountId }, serverRuntimeConfig.secret, { expiresIn: '1d' }); // TODO: Expiration dates from Config Values
    const features = jwt.sign({ sub: savedUser.account.accoutFeatures }, serverRuntimeConfig.secret, { expiresIn: '1d' }); // TODO: Expiration dates from Config Values
    // return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userRole: user.userRole,
        accountId: user.accountId,
        passwordExpired: user.passwordExpired,
        lastSignIn: user.lastSignIn,
        features,
        authToken,
        accountToken
    });
  }
  else {
    // insert access denied code here
    console.log("Access Denied!");
    res.status(400).json({ message: ErrorMessage.INVALID_LOGON_CREDENTIALS });
  }
}