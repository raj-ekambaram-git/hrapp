// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoiceId = req.query?.invoiceId;
    const accountId = req.query?.accountId;

    console.log("INSIDE TRANSACTIONS:::INVOICEID:::"+invoiceId+"******ACCOUNTID::"+accountId)
    
    if(invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const invoiceTransactions = await prisma.invoiceTransaction.findMany({
        where: {
          invoiceId: {
            equals: parseInt(invoiceId.toString())            
          },
          invoice:{
            accountId: parseInt(accountId.toString())
          }
        },
        include: {
          invoice: {
            select: {
              total: true,
              paidAmount: true
            }
          }
        }
      })
      console.log("invoiceTransactions:::"+JSON.stringify(invoiceTransactions))
        res.status(200).json(invoiceTransactions);
  
    } else if (invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId == "NaN") {
      const invoiceTransactions = await prisma.invoiceTransaction.findMany({
        where: {
          id: {
            equals: parseInt(invoiceId.toString())            
          }
      },
      })
      
        res.status(200).json(invoiceTransactions[0]);
  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
