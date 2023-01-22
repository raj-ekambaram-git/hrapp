// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const expenseId = req.query?.expenseId;
    const accountId = req.query?.accountId;

    console.log("INSIDE TRANSACTIONS:::expenseId:::"+expenseId+"******ACCOUNTID::"+accountId)
    
    if(expenseId != EMPTY_STRING && expenseId != undefined && accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
      const expenseTransactions = await prisma.expenseTransaction.findMany({
        where: {
          expenseId: {
            equals: parseInt(expenseId.toString())            
          },
          expense:{
            project: {
              accountId: parseInt(accountId.toString())
            } 
          }
        },
        include: {
          expense: {
            select: {
              total: true,
              paidAmount: true
            }
          }
        }
      })

        res.status(200).json(expenseTransactions);
  
    }else {
      res.status(400).json({ message: 'Not able to get the expense transactions' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
