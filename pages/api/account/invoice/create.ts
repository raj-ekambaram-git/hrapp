// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import {  InvoiceConstants } from "../../../../constants";
import prisma from "../../../../lib/prisma";
import { invoiceService } from "../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  try {
    const invoice = req.body;
    
    const savedInvoice = await prisma.invoice.create({
      data: invoice,
      include: InvoiceConstants.INVOICE_DETAIL_TO_GENERATE_FILE.include
    });
        
    res.status(200).json(savedInvoice);
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
