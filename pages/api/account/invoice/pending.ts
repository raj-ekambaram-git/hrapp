// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {userId} = req.body;
    const {accountId} = req.body;
    console.log("userId::::::"+userId+"*****accountId::"+accountId)
    if(userId && accountId) {

      const invoices = await prisma.invoice.findMany({
        where: {
          accountId: {
            equals: parseInt(accountId.toString())
          },
          status: {
            in: [InvoiceStatus.Submitted, InvoiceStatus.PartiallyPaid]
          },
      },
      include: {
        invoiceTransaction: true
      }
      })
        console.log("invoices::::"+JSON.stringify(invoices))
        res.status(200).json(invoices);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
