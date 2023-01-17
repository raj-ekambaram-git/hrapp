// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("expense create");
    const {expenseRequest} = req.body;

    console.log("expense cretion::"+JSON.stringify(expenseRequest))
    
    const savedExpense = await prisma.expense.create({
      data: expenseRequest
    });
    res.status(200).json(savedExpense);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
