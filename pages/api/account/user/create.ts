// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../../constants";
import { util } from "../../../../helpers/util";
import prisma from "../../../../lib/prisma";
import { emailService } from "../../../../services";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import { WorkFlowType } from "@prisma/client";
const { serverRuntimeConfig } = getConfig();


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.body;

    console.log("API CREATE::"+JSON.stringify(user))
    //get Salt for passowrd
    if(user.createData?.password != undefined) {
      const tempPassword = util.getTempPassword();
      const passwordHash = util.getPasswordHash(tempPassword);
      user.createData.passwordSalt = passwordHash.passwordSalt;
      user.createData.password = passwordHash.passwordHash;
      user.createData.passwordExpired = true
      user.createData.passwordRetries = 5

      console.log("passwordHash:::"+passwordHash);

      const savedUser = await prisma.user.create({
        data: user.createData,
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

        if(savedUser && savedUser.workFlowEnabled && user.workFlow) {
          //Now persist the workflow data
          const steps = user.workFlow?.steps?.map((step, index) => {
            step.taskId = parseInt(step.taskId)
            step.assignedTo = parseInt(step.assignedTo)
            step.stepNumber = index+1
            return step;
          })
          const savedWorkFlow = await prisma.workFlow.create({
            data: {
              type: WorkFlowType.User,
              typeId: savedUser.id,
              accountId: savedUser.accountId,
              name: user.workFlow.name,
              status: user.workFlow.status,
              updatedBy: user.workFlow.userId,
              workFlowSteps: {
                create: steps
              }
            }
          });
        }

        const newSavedUserForEmail = {...savedUser}
        console.log("req.headers.referer::"+req.headers.referer)
        const passwordToken = jwt.sign({ sub: tempPassword}, serverRuntimeConfig.secret, { expiresIn: '30m' }); // TODO: Expiration dates from Config Values

        newSavedUserForEmail["tempPassword"] = req.headers.referer.split("account")[0]+"changepassword?userId="+savedUser.id+"&maskedTempPassword="+passwordToken
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