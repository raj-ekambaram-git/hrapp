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

      console.log("userVendor UPDATE:::"+JSON.stringify(userVendorData));

      const savedUserVendor = await prisma.vendorUsers.create({
        data: userVendorData.userVendorData,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
              phone: true,
              userRole: true
            }
          },
          vendor: {
            select: {
              name: true
            },
          }
        }
      });

      console.log("savedUserVendor:::"+JSON.stringify(savedUserVendor))
      res.status(200).json(savedUserVendor);
  
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
