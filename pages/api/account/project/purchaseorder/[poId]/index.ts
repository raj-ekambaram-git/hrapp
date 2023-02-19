// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {poRequest} = req.body;

    console.log("INSIDE PO UPDATE:::"+JSON.stringify(poRequest));
    
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedPO = await prisma.purchaseOrder.update({
      where: {
        id: poRequest.id,
      },
      data: poRequest
    });
    res.status(200).json(savedPO);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
