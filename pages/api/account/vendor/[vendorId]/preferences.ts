// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const vendorId = req.query?.vendorId;
    const accountId = req.query?.accountId;

    console.log("vendorId:::"+vendorId+"****AccountID ::"+accountId)
    if(vendorId && accountId) {
      const vendorPreferences = await prisma.vendorSetting.findMany({
        where: {
          vendor:{
            id: parseInt(vendorId.toString()),
            accountId: parseInt(accountId.toString())
          }
        },
      });
      res.status(200).json(vendorPreferences);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while getting vendor preferences.' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
