// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import {EMPTY_STRING} from "../../../../constants/accountConstants";
import { NotesType } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {expense} = req.body;
    const {expenseNote} = req.body;
    const {notesCreatedBy} = req.body;

    console.log("expense status Data:::"+JSON.stringify(expense));
    
    const savedExpense =  await prisma.$transaction(async (tx) => {
      const savedExpense = await prisma.expense.update({
        where: {
          id: expense.id,
        },
        data: {
          ...expense,
          expenseEntries: {
            updateMany: {
              where: {
                expenseId: expense.id,
              },
              data:
              {
                status: expense.status
              }
            }
          }        
        }
      });

      const savedNotes = await prisma.notes.create({
        data: {
          type: NotesType.Expense, typeId: expense.id, notes: expenseNote, createdBy: notesCreatedBy
        },
        include: {
          replies: true,
          createdUser: {
            select: {
              firstName: true,
              lastName: true
            },
            
          }
        }
      });

      return savedExpense;
  });

    res.status(200).json(savedExpense);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
