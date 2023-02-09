// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";




export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }


  try {
    const {workFlowRequest} = req.body;
    const accountId = req.query.accountId;
    const workFlowId = req.query.accountId;
    if(accountId && workFlowRequest && workFlowId) {
      const savedWorkFlow = await prisma.workFlow.update({
        where: {            
          id: workFlowRequest.id
        },
        data: workFlowRequest,
        include: {
          updatedUser: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      res.status(200).json(savedWorkFlow);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
