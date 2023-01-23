// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING, EXPENSE_STATUS, TIMESHEET_STATUS } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req?.query?.projectId;
  const accountId = req?.query?.accountId;
  const status = req?.query?.status;
  let whereStatusValue = [];
  const includeFields = {
    approvedBy: {
      select: {
        firstName: true,
        lastName: true
      }
    },
    expenseEntries: true,
    user: {
      select: {
        firstName: true,
        lastName: true
      }
    }     
   };


  if(status != undefined && status != EMPTY_STRING && status == EXPENSE_STATUS.Pending) {
    whereStatusValue = [ExpenseStatus.Draft, ExpenseStatus.Saved, ExpenseStatus.Submitted, ExpenseStatus.Rejected]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Approved ) {
    whereStatusValue = [ExpenseStatus.Approved]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Invoiced) {
    whereStatusValue = [ExpenseStatus.Invoiced]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Rejected) {
    whereStatusValue = [ExpenseStatus.Rejected]
  }

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId+"--status::"+status)
  
  try {
    if(projectId != EMPTY_STRING && projectId != undefined && status != undefined && status != EMPTY_STRING && whereStatusValue != undefined) {
      const expenses = await prisma.expense.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())
            },
            status: {
              in: whereStatusValue,
            },
            project: {
              accountId: {
                equals: parseInt(accountId.toString())
              }
            }
        },
        orderBy: {
          id: "desc"
        },
       include: includeFields
      });

      console.log("PROJECT expenses::BY STTAUS :"+JSON.stringify(expenses))
      res.status(200).json(expenses);
    } else if(projectId != EMPTY_STRING && projectId != undefined) {

      const expenses = await prisma.expense.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())
            },
            project: {
              accountId: {
                equals: parseInt(accountId.toString())
              }
            }
        },
        orderBy: {
          id: "desc"
        },
       include: includeFields
      });

      console.log("PROJECT expenses:::"+JSON.stringify(expenses))
      res.status(200).json(expenses);
    }
    else {
      res.status(400).json({ message: 'Something went wrong while getting project resources' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
