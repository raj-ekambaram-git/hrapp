// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseCategory, ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING, EXPENSE_STATUS, TIMESHEET_STATUS } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req?.query?.projectId;
  const accountId = req?.query?.accountId;

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId)
  
  try {
    if(projectId && projectId) {
      const suppliers = await prisma.vendor.findMany({
        where: {
          projectResource: {
            some: {
              projectId: {
                equals: parseInt(projectId.toString())
              }
            },            
          },
        },
        include: {
          projectResource: {
            where: {
              projectId: {
                equals: parseInt(projectId.toString())
              }
            }
          }
        },
        orderBy: {
          id: "desc"
        },
      });

      console.log("PROJECT suppliers:: :"+JSON.stringify(suppliers))
      res.status(200).json(suppliers);
    }  else {
      res.status(400).json({ message: 'Something went wrong while getting project suppluer' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
