// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {accountId} = req.body;
    const {pastDueDays} = req.body;    
    console.log("*****accountId::"+accountId+"****pastDueDays:::"+pastDueDays)
    if(accountId && pastDueDays) {
      let pastDate = new Date();
      let whereClause = {
        accountId: {
          equals: parseInt(accountId.toString())
        },
        status: {
          in: [InvoiceStatus.Submitted, InvoiceStatus.PartiallyPaid]
        },
      }
      if(pastDueDays != "all") {
        pastDate.setDate(pastDate.getDate() - parseInt(pastDueDays));
        whereClause['dueDte'] =  {
          lt: pastDate
        }
      } 

      const invoices = await prisma.invoice.findMany({
        where: whereClause,
        include: {
          vendor: {
            select: {
              name: true
            },
          },
          account: {
            select: {
              name: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        }
      })
        res.status(200).json(invoices);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
