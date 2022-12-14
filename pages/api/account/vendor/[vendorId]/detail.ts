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
    const vendors = await prisma.vendor.findMany({
      where: {
        id: {
          equals: parseInt(vendorId.toString())            
        },
        accountId: {
          equals: parseInt(accountId.toString())
        }
    },
      include: {
        address: true,
      }
    })
      res.status(200).json(vendors[0]);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
