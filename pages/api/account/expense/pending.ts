// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {userId} = req.body;
    const {accountId} = req.body;
    console.log("userId::::::"+userId+"*****accountId::"+accountId)
    if(userId && accountId) {

      const expenses = await prisma.expense.findMany({
        where: {
          project: {
            accountId: {
              equals: parseInt(accountId.toString())
            }
          },
          status: {
            in: [ExpenseStatus.Submitted, ExpenseStatus.PartiallyPaid]
          },
      }
      })
        console.log("expenses::::"+JSON.stringify(expenses))
        res.status(200).json(expenses);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while getting expenses' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting expenses' })
  }
}
