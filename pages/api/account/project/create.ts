// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const project = req.body;
    
    // const user: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedProject = await prisma.project.create({
      data: project.createData
    });


    if(savedProject && savedProject.workFlowEnabled && project.workFlow) {
      //Now persist the workflow data
      const steps = project.workFlow?.steps?.map((step, index) => {
        step.taskId = parseInt(step.taskId)
        step.assignedTo = parseInt(step.assignedTo)
        step.stepNumber = index+1
        return step;
      })

      const savedWorkFlow = await prisma.workFlow.create({
        data: {
          type: WorkFlowType.Project,
          typeId: savedProject.id,
          accountId: savedProject.accountId,
          name: project.workFlow.name,
          status: project.workFlow.status,
          updatedBy: project.workFlow.userId,
          workFlowSteps: {
            create: steps
          }
        }
      });
    }

    res.status(200).json(savedProject);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
