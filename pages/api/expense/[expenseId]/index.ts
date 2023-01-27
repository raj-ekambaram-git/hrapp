// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import {EMPTY_STRING} from "../../../../constants/accountConstants";
import { ExpenseStatus } from "@prisma/client";
import { emailService, expenseService } from "../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {expense} = req.body;
    const {expenseEntries} = req.body;

    console.log("expense Data:::"+JSON.stringify(expense));
    
    const savedExpense = await prisma.expense.update({
      where: {
        id: expense.id,
      },
      data: {
        ...expense,
        expenseEntries: {
          deleteMany: {
            expenseId: expense.id,
            NOT: expenseEntries?.map(({ id }) => ({ id })),
          },
          upsert: expenseEntries?.map((expenseEntry) => ({ 
            where: { id: expenseEntry.id?expenseEntry.id:0 },
            create: {...expenseEntry, status: expense.status},
            update: {...expenseEntry, status: expense.status},
          }))          
        }
      },
      include: {        
        project: {
          select: {
            name: true,
            contactEmail: true,
            vendor: {
              select: {
                name: true,
                email: true
              }
            },
            projectResource: {
              where: {
                isTimesheetApprover: true
              },
              select: {
                user: {
                  select: {
                    email: true
                  }
                }
              }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          },        
        }
      }
    });

    if(savedExpense && savedExpense.status === ExpenseStatus.Submitted) {
        const emailResponse = emailService.sendEmail(expenseService.getNewExpenseEmailRequest(savedExpense));
        if(!emailResponse.error) {
          console.log("error happened sending email:::"+JSON.stringify(savedExpense))
        } 

    }


    res.status(200).json(savedExpense);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
