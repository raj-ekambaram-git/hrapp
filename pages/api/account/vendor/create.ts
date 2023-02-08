// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const vendor = req.body;

    const savedVendor = await prisma.vendor.create({
      data: vendor.createData
    });

    if(savedVendor && savedVendor.workFlowEnabled && vendor.workFlow) {
      //Now persist the workflow data
      const steps = vendor.workFlow?.steps?.map((step, index) => {
        step.taskId = parseInt(step.taskId)
        step.assignedTo = parseInt(step.assignedTo)
        step.stepNumber = index+1
        return step;
      })
      const savedWorkFlow = await prisma.workFlow.create({
        data: {
          type: WorkFlowType.Vendor,
          typeId: savedVendor.id,
          accountId: savedVendor.accountId,
          name: vendor.workFlow.name,
          status: vendor.workFlow.status,
          updatedBy: vendor.workFlow.userId,
          workFlowSteps: {
            create: steps
          }
        }
      });
    }
    res.status(200).json(savedVendor);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
