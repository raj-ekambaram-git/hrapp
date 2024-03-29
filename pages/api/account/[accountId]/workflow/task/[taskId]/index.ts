// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {taskRequest} = req.body;
    const accountId = req.query.accountId;
    
    const savedWFTask = await prisma.workFlowTask.update({
      where: {
        id: taskRequest.id,
      },
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
    res.status(200).json(savedWFTask);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
