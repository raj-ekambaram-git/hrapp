// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus, InvoiceTransactionStatus, TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";
import { selectAccountId } from "../../../../../store/authSlice";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const accountId = req.query?.accountId;
    console.log("accountId:INVOICE REPORT:::"+accountId)
    
    if(accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
        const invoiceReportData = {};
        const pastFiften = new Date();
        pastFiften.setDate(pastFiften.getDate() - 15);
        const pastThirty = new Date();
        pastThirty.setDate(pastThirty.getDate() - 30);
        const pastFortyFive = new Date();
        pastFortyFive.setDate(pastFortyFive.getDate() - 45);
        const pastFortySixty = new Date();
        pastFortySixty.setDate(pastFortySixty.getDate() - 60);

        const invoiceReportTxn =  await prisma.$transaction(async (tx) => {
          const allPastInvoiceDue = await prisma.$queryRaw`select  ''||count("id") as invoiceCount, sum("total")-sum("paidAmount") as total from "Invoice" where status in ('Submitted','PartiallyPaid') and "accountId" = ${parseInt(accountId.toString())}`    

          const invoicesPastFifteen = await prisma.$queryRaw`select  ''||count("id") as invoiceCount, sum("total")-sum("paidAmount") as total from "Invoice" where status in ('Submitted','PartiallyPaid') and "accountId" = ${parseInt(accountId.toString())} and "dueDte" < ${pastFiften}`    
          const invoicesPastTHirty = await prisma.$queryRaw`select  ''||count("id") as invoiceCount, sum("total")-sum("paidAmount") as total from "Invoice" where status in ('Submitted','PartiallyPaid') and "accountId" = ${parseInt(accountId.toString())} and "dueDte" < ${pastThirty}`    
          const invoicesPastFortFive = await prisma.$queryRaw`select  ''||count("id") as invoiceCount, sum("total")-sum("paidAmount") as total from "Invoice" where status in ('Submitted','PartiallyPaid') and "accountId" = ${parseInt(accountId.toString())} and "dueDte" < ${pastFortyFive}`    
          const invoicesPastSixty = await prisma.$queryRaw`select  ''||count("id") as invoiceCount, sum("total")-sum("paidAmount") as total from "Invoice" where status in ('Submitted','PartiallyPaid') and "accountId" = ${parseInt(accountId.toString())} and "dueDte" < ${pastFortySixty}`    
          invoiceReportData["all"] = allPastInvoiceDue;
          invoiceReportData["pastFifteen"] = invoicesPastFifteen;
          invoiceReportData["pastThirty"] = invoicesPastTHirty;
          invoiceReportData["pastFortyFive"] = invoicesPastFortFive;
          invoiceReportData["pastSixty"] = invoicesPastSixty;
          console.log("invoiceReportData::"+JSON.stringify(invoiceReportData))
       })      

        

      res.status(200).json(invoiceReportData);  
    } 
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
