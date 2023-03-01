// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import {EMPTY_STRING} from "../../../../constants/accountConstants";
import { ExpenseEntryStatus, NotesType } from "@prisma/client";
import { emailService, expenseService } from "../../../../services";

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
        },
        select: {
          id: true,
          status: true,
          project: {
            select: {
              id: true,
              usedMiscBudget: true
            }
          },
          expenseEntries: true
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

      //Send email here 
      if(savedExpense && (savedExpense.status === ExpenseEntryStatus.Approved || savedExpense.status === ExpenseEntryStatus.Rejected)) {

        const expenseDetailsForEmail = await prisma.expense.findUnique({
          where: {
            id: savedExpense.id,
          },
          select: {
            status: true,   
            total: true,
            billable: true,
            name: true,
            createdDate: true,
            project: {
              select: {
                name: true,
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
                },
                vendor: {
                  select: {
                    name: true
                  }
                }
              }
            },
            approvedBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true                
              }
            }
          }
        });
        const authHeader = {Authorization: req.headers.authorization}
        const emailResponse = emailService.sendEmail(expenseService.getExpenseApprovalEmailRequest(expenseDetailsForEmail, expenseNote), authHeader);
            if(!emailResponse.error) {
              console.log("error happened sending email:::"+JSON.stringify(savedExpense))
            }              
        }

      return savedExpense;
  });

    res.status(200).json(savedExpense);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
