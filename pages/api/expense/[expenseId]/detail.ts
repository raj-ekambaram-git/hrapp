// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const expenseId = req.query?.expenseId;
    const accountId = req.query?.accountId;
    
    if(expenseId != "" && expenseId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const expenses = await prisma.expense.findMany({
        where: {
          id: {
            equals: parseInt(expenseId.toString())            
          },
      },
        include: {
          approvedBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          expenseEntries: {
            select: {
              id: true,
              type: true,
              billable: true,
              expenseDate: true,
              amount: true,
              status: true,
              notes: true,
              lastUpdateDate: true,
            }
          }
        }
      })
      
        res.status(200).json(expenses[0]);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
