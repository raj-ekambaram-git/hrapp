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
    
    if(invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
          id: {
            equals: parseInt(invoiceId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          }
      },
        include: {
          project: true,
          invoiceItems: true
        }
      })
      
        res.status(200).json(invoices[0]);
  
    } else if (invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId == "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
          id: {
            equals: parseInt(invoiceId.toString())            
          }
      },
        include: {
          project: true          
        }
      })
        res.status(200).json(invoices[0]);
  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
