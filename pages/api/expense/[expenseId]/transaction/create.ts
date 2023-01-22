// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ExpenseConstants } from "../../../../../constants";
import { util } from "../../../../../helpers/util";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  try {
    const expenseTransaction = req.body;
    console.log("expenseTransaction data::"+JSON.stringify(expenseTransaction))
    
    // const user: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedExpenseTransaction = await prisma.expenseTransaction.create({
      data: expenseTransaction,
      include: {
        expense: {
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
    if(expenseTransaction.status !== ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Pending) {
      if(expenseTransaction.status === ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Refund
        || expenseTransaction.status === ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Cancelled) {
          finalPaidAmount = util.getZeroPriceForNull(savedExpenseTransaction?.expense?.paidAmount)-util.getZeroPriceForNull(expenseTransaction.amount);
      }else if (expenseTransaction.status === ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Paid) {
          finalPaidAmount = util.getZeroPriceForNull(expenseTransaction.amount)+util.getZeroPriceForNull(savedExpenseTransaction?.expense?.paidAmount)
      }


    
      let updatedStatus = savedExpenseTransaction?.expense?.status;
      let invoiceTotal = savedExpenseTransaction?.expense?.total;
      if( util.getZeroPriceForNull(invoiceTotal) == finalPaidAmount) {
        updatedStatus = ExpenseStatus.Paid;
      } else if(finalPaidAmount > 0) {
        updatedStatus = ExpenseStatus.PartiallyPaid;
      }

      const savedInvoice = await prisma.expense.update({
        where: {
          id: savedExpenseTransaction.expenseId,
        },
        data: {
          paidAmount: finalPaidAmount,
          status: updatedStatus
        }
      });
    }

    res.status(200).json({expenseTransaction: savedExpenseTransaction, finalPaidAmount: finalPaidAmount});
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
