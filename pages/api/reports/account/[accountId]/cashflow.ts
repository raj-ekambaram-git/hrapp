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
    
        const monthly = await prisma.$queryRaw`select tx_period,
        string_agg(distinct tranStatus||'_'||monthly_sum, ',' order by  tranStatus||'_'||monthly_sum) as total 
         from (
        SELECT date_trunc('month', tran."createdDate") AS tx_period, sum(tran.amount) as monthly_sum, tran.status as tranStatus FROM "InvoiceTransaction" as tran, "Invoice" as inv where 
        inv."accountId" = 5
        and tran."invoiceId" = inv.id
        and tran.status in ('Paid','Refund', 'Cancelled') 
        GROUP BY tx_period, tran.status order by tx_period desc ) as temp_table group by tx_period`

        const weekly = await prisma.$queryRaw`
        select tx_period,
        string_agg(distinct tranStatus||'_'||weekly_sum, ',' order by  tranStatus||'_'||weekly_sum) as total 
         from (
        SELECT date_trunc('week', tran."createdDate") AS tx_period, sum(tran.amount) as weekly_sum, tran.status as tranStatus FROM "InvoiceTransaction" as tran, "Invoice" as inv where 
        inv."accountId" = ${parseInt(accountId.toString())}
        and tran."invoiceId" = inv.id
        and tran.status in ('Paid','Refund', 'Cancelled') 
        GROUP BY tx_period, tran.status order by tx_period desc ) as temp_table group by tx_period`

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
