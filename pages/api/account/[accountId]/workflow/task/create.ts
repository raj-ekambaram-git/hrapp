// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {taskRequest} = req.body;
    const accountId = req.query.accountId;
    console.log("TASK:::"+JSON.stringify(taskRequest)+"****ACCOUNT ID::"+accountId)
    const savedTask = await prisma.workFlowTask.create({
      data: taskRequest,
      include: {
        updatedUser: {
          select: {
            firstName: true,
            lastName: true
          }
        }
        }      
    });

    res.status(200).json(savedTask);
  } catch (error) {
    console.log(error)
    if(error.code == "P2002") {
      res.status(400).json({ message: 'Task already exists for this type, please verify.' })
    }else {
      res.status(400).json({ message: 'Something went wrong while saving account' })
    }
    
  }
}

