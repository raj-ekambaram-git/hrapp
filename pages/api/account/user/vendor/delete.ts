// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
const bcrypt = require('bcryptjs');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userVendorData = req.body;

      console.log("userVendor:::"+JSON.stringify(userVendorData));

      const savedUserVendor = await prisma.vendorUsers.delete({
          where: {
            id: userVendorData.removeRequest.id,
          } ,
          include: {
          vendor: {
            select: {
              name: true
            }
          }
        }
      });
      res.status(200).json(savedUserVendor);
  
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
