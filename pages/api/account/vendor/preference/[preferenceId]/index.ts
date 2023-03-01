// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { VendorSettingStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {updateRequest} = req.body;
    
    if(updateRequest && updateRequest.id) {
      if(updateRequest.status === VendorSettingStatus.MarkForDelete) {
        const deleteVendorSetting = await prisma.vendorSetting.delete({
          where: {
            id: updateRequest.id
          },
        });
        res.status(200).json(deleteVendorSetting);  
      } else {
        const savedVendorSetting = await prisma.vendorSetting.update({
          where: {
            id: updateRequest.id,
          },
          data: updateRequest
        });

        res.status(200).json(savedVendorSetting);  
      }
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
