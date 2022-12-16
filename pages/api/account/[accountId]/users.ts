// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const vendorId = req.query.vendorId;
  const accountId = req.query.accountId;


  
  try {
    if(vendorId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && vendorId != undefined) {
      const users = await prisma.user.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }
      });
      res.status(200).json(users);
    } else if (accountId != "" && accountId != undefined && vendorId == ""){
      const users = await prisma.user.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });
      res.status(200).json(users);
    }else if (vendorId != "" && vendorId != undefined && accountId == "NaN") {
      const users = await prisma.user.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });

      res.status(200).json(users);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
