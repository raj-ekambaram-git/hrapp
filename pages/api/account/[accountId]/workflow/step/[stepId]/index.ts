// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {stepRequest} = req.body;
    const accountId = req.query.accountId;
    
    const savedStep = await prisma.workFlowStep.update({
      where: {
        id: stepRequest.id,
      },
      data: stepRequest,
      
    });
    res.status(200).json(savedStep);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating a workflow step.' })
  }
}
