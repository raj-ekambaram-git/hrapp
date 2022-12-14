// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  try {
    const invoiceTransaction = req.body;
    console.log("invoiceTransaction data::"+JSON.stringify(invoiceTransaction))
    
    // const user: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedInvoiceTransaction = await prisma.invoiceTransaction.create({
      data: invoiceTransaction
    });
    res.status(200).json(savedInvoiceTransaction);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
