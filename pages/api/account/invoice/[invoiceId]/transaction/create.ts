// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { InvoiceConstants } from "../../../../../../constants";
import { util } from "../../../../../../helpers/util";
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
      data: invoiceTransaction,
      include: {
        invoice: {
          select: {
            paidAmount: true,
            status: true,
            total: true
          }
        }
      }
    });

    let finalPaidAmount = 0;

    //Transaction added and now update the invoice with the correct paid amount
    if(invoiceTransaction.status !== InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Pending) {
      if(invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund
        || invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled) {
          finalPaidAmount = util.getZeroPriceForNull(savedInvoiceTransaction?.invoice?.paidAmount)-util.getZeroPriceForNull(invoiceTransaction.amount);
      }else if (invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Paid) {
        finalPaidAmount = util.getZeroPriceForNull(invoiceTransaction.amount)+util.getZeroPriceForNull(savedInvoiceTransaction?.invoice?.paidAmount)
      }


    
      let updatedStatus = savedInvoiceTransaction?.invoice?.status;
      let invoiceTotal = savedInvoiceTransaction?.invoice?.total;
      if( util.getZeroPriceForNull(invoiceTotal) == finalPaidAmount) {
        updatedStatus = InvoiceStatus.Paid;
      } else if(finalPaidAmount > 0) {
        updatedStatus = InvoiceStatus.PartiallyPaid;
      }
  
      const savedInvoice = await prisma.invoice.update({
        where: {
          id: savedInvoiceTransaction.invoiceId,
        },
        data: {
          paidAmount: finalPaidAmount,
          status: updatedStatus,
        }
      });
    }

    res.status(200).json({invoiceTransaction: savedInvoiceTransaction, finalPaidAmount: finalPaidAmount});
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
