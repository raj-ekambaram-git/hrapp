// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";
import { emailService, expenseService } from "../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("expense create");
    const {expenseRequest} = req.body;

    console.log("expense cretion::"+JSON.stringify(expenseRequest))
    
    const savedExpense = await prisma.expense.create({
      data: expenseRequest,
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
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
