// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("req.body:::"+JSON.stringify(req.body))
    const vendor = req.body;

    console.log("Vendor cretion::"+JSON.stringify(vendor))
    
    const savedVendor = await prisma.vendor.create({
      data: vendor.createData
    });
    res.status(200).json(savedVendor);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
