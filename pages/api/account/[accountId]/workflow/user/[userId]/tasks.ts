// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";
import {isAuthorized} from '../../../../../../../helpers/api/api-auth-middleware'
import { WorkFlowStepStatus } from "@prisma/client";
import { count } from "console";
import { WorkFlowConstants } from "../../../../../../../constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  if(isAuthorized(req)) {
    try {
      const {accountId} = req.body;
      const {userId} = req.body;
      const {taskStatus} = req.body;
      const {taskRequestType} = req.body;
      
      console.log("USER ID:::"+userId+"****AccountID ::"+accountId+"*****taskStatus::::"+taskStatus+"****taskRequestType::"+taskRequestType)
      if(userId && accountId && taskRequestType && taskStatus) {

        let whereClause = {
          assignedTo: parseInt(userId.toString()),
          status: taskStatus.toString(),
          workFlow: {
            accountId: parseInt(accountId.toString())
          }
        }
        if(taskRequestType == WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.pastDue) {
          whereClause["dueDate"]= {
            lt: new Date(new Date().toLocaleDateString())
          }
        } else if (taskRequestType == WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.currentDue) {
          whereClause["dueDate"]= {
            equals: new Date(new Date().toLocaleDateString())
          }
        }

        console.log("whereClause:::"+JSON.stringify(whereClause))
        const myTasks = await prisma.workFlowStep.findMany({
          where: whereClause,
          include: {
            workFlow: {
              select: {
                type: true,
                typeId: true,
                status: true
              },              
            },
            task: {
              select: {
                type: true,
                name: true,
                description: true
              }
            }
          }
        })
  
        console.log("myTasks:::"+JSON.stringify(myTasks))
          res.status(200).json(myTasks);
      } else {
        res.status(400).json({ message: 'Something went wrong while updating' })
      }

    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong while updating' })
    }

  }else {
    res.status(400).json({ status: 400, message: 'Invalid Authentication Credentials' });
  }


}
