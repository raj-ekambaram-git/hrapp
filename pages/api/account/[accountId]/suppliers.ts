// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { VendorStatus, VendorType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const accountId = req.query.accountId;
  console.log("suppliers Account ::"+accountId)
  try {
    if(accountId) {
      const suppliers = await prisma.vendor.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: VendorStatus.MarkForDelete
            },
            type: {
              equals: VendorType.Supplier
            }
        },
        orderBy: {
          lastUpdateDate: "desc"
        }
      });

      console.log("suppliers:::"+JSON.stringify(suppliers))
      res.status(200).json(suppliers);
    } else {
      res.status(400).json({ message: 'Something went wrong while getting suppliers' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting suppliers' })
  }
}
