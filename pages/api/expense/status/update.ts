// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const expenseRequest = req.body;
    const savedExpenses = await prisma.expense.updateMany({
      where: {
        id: {
          in: expenseRequest.expenseIds
        }
      },
      data: expenseRequest.data
    });
    res.status(200).json(savedExpenses);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
