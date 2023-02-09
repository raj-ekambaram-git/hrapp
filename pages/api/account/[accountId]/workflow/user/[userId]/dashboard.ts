// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";
import {isAuthorized} from '../../../../../../../helpers/api/api-auth-middleware'
import { WorkFlowStepStatus } from "@prisma/client";
import { count } from "console";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  if(isAuthorized(req)) {
    try {
      const accountId = req.query?.accountId;
      const userId = req.query?.userId;
      console.log("USER ID:::"+userId+"****AccountID ::"+accountId)
      const groupedWorkFlowSteps = await prisma.workFlowStep.groupBy({
        by: ['status'],
        where: {
          status: {
            in: [WorkFlowStepStatus.Pending, WorkFlowStepStatus.InProgress, WorkFlowStepStatus.Delayed, WorkFlowStepStatus.Skipped]
          }
        },   
        _count: true     
      })

      const groupedWorkFlowStepsPastDue = await prisma.workFlowStep.groupBy({
        by: ['status'],
        where: {
          status: {
            in: [WorkFlowStepStatus.Pending, WorkFlowStepStatus.InProgress, WorkFlowStepStatus.Delayed, WorkFlowStepStatus.Skipped]
          },
          dueDate: {
            lt: new Date(new Date().toLocaleDateString())
          }
        },   
        _count: true     
      })

      const groupedWorkFlowStepsCurrentDue = await prisma.workFlowStep.groupBy({
        by: ['status'],
        where: {
          status: {
            in: [WorkFlowStepStatus.Pending, WorkFlowStepStatus.InProgress, WorkFlowStepStatus.Delayed, WorkFlowStepStatus.Skipped]
          },
          dueDate: {
            equals: new Date(new Date().toLocaleDateString())
          }
        },   
        _count: true     
      })      
      console.log("groupedWorkFlowSteps:::"+JSON.stringify(groupedWorkFlowSteps))
      console.log("groupedWorkFlowStepsPastDue::"+JSON.stringify(groupedWorkFlowStepsPastDue))
      console.log("groupedWorkFlowStepsCurrentDue::"+JSON.stringify(groupedWorkFlowStepsCurrentDue))
      const responseData = {
        all: groupedWorkFlowSteps,
        pastDue: groupedWorkFlowStepsPastDue,
        todayDue: groupedWorkFlowStepsCurrentDue
      }
        res.status(200).json(responseData);
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong while updating' })
    }

  }else {
    res.status(400).json({ status: 400, message: 'Invalid Authentication Credentials' });
  }


}
