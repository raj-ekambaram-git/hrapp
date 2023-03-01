// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("req.body:::"+JSON.stringify(req.body))
    const {vendorSettingRequest} = req.body;

    if(vendorSettingRequest) {
      const savedVendorSetting = await prisma.vendorSetting.create({
        data: vendorSettingRequest
      });
      res.status(200).json(savedVendorSetting);
    } else {
      res.status(400).json({ message: 'Something went wrong while saving vendor preference' })
    }
    
  } catch (error) {
    console.log(error)
    if(error.code === "P2002") {
      res.status(400).json({ message: 'Preference already exists for this client, please check.' })
    } else {
      res.status(400).json({ message: 'Something went wrong while saving vendor preference' })
    }
    
  }
}
