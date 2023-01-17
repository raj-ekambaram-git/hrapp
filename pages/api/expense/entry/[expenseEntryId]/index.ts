// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const expenseEntry = req.body;
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedExpenseEntry = await prisma.expenseEntry.update({
      where: {
        id: expenseEntry.id,
      },
      data: expenseEntry,
    });
    console.log("saved TimesheetEntry::"+JSON.stringify(savedExpenseEntry))
    res.status(200).json(savedExpenseEntry);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
