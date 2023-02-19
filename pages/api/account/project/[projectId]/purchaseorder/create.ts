// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {poRequest} = req.body;
    
    console.log("poRequest:::"+JSON.stringify(poRequest))
    const savedPO = await prisma.purchaseOrder.create({
      data: poRequest
    });


    if(savedPO) {

    }

    res.status(200).json(savedPO);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
