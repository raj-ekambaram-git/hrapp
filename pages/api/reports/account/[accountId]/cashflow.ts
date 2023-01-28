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
    console.log("accountId::"+accountId)
    
    if(accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
        const cashFlowData = {};
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);
        const pastMonth = new Date();
        pastMonth.setDate(pastMonth.getDate() - 30);
    
        const monthly = await prisma.$queryRaw`
        SELECT date_trunc('month', tran."createdDate") AS txn_month, sum(tran.amount) as monthly_sum , tran.status FROM "InvoiceTransaction" as tran, "Invoice" as inv where 
        inv."accountId" = ${parseInt(accountId.toString())}
        and tran."invoiceId" = inv.id
        and tran.status in ('Paid','Refund', 'Cancelled') 
        GROUP BY txn_month, tran.status order by txn_month desc`

        const weekly = await prisma.$queryRaw`SELECT date_trunc('week', tran."createdDate") AS txn_week, sum(tran.amount) as weekly_sum , tran.status FROM "InvoiceTransaction" as tran, "Invoice" as inv where 
        inv."accountId" = ${parseInt(accountId.toString())}
        and tran."invoiceId" = inv.id
        and tran.status in ('Paid','Refund', 'Cancelled') 
        GROUP BY txn_week, tran.status order by txn_week desc`

        const lifeTime = await prisma.$queryRaw`select sum("paidAmount") as total from "Invoice" where "accountId" = ${parseInt(accountId.toString())} and status in ('Paid', 'PartiallyPaid')`
        
        cashFlowData["lifeTime"] = lifeTime?lifeTime:parseFloat("0")
        cashFlowData["monthly"] = monthly?monthly:parseFloat("0")
        cashFlowData["weekly"] = weekly?weekly:parseFloat("0")

        console.log("cashFlowData::"+JSON.stringify(cashFlowData))

      res.status(200).json(cashFlowData);  
    } 
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
