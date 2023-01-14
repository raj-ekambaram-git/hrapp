// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING, InvoiceConstants } from "../../../../constants";
import prisma from "../../../../lib/prisma";
import { emailService, invoiceService } from "../../../../services";
import { CommonConstants, EmailConstants} from "../../../../constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  try {
    const invoice = req.body;
    
    if((invoice.status != undefined && (invoice.status === InvoiceConstants.INVOICE_STATUS.Submitted
      || invoice.status === InvoiceConstants.INVOICE_STATUS.Cancelled))) {
        const savedInvoice = await prisma.invoice.create({
          data: invoice,
          include: InvoiceConstants.INVOICE_DETAIL_TO_GENERATE_FILE.include
        });

        //Call the email function to send the eamil with attachnebt
        if(savedInvoice != undefined && savedInvoice != null) {
          // sendInvoiceEmail(savedInvoice)
          invoiceService.sendInvoiceEmail(savedInvoice)
        }
        
        res.status(200).json(savedInvoice);
      }else {
        const savedInvoice = await prisma.invoice.create({
          data: invoice,
        });
        res.status(200).json(savedInvoice);
      }
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
