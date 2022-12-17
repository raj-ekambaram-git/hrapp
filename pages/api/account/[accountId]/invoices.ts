// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  const accountId = req.query.accountId;


  
  try {
    if (accountId != "" && accountId != undefined){
      console.log("2222")
      const invoices = await prisma.invoice.findMany({
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
      res.status(200).json(invoices);

    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
