// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseCategory, ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../../constants";
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.userId;
  const accountId = req.query.accountId;

console.log("userId ID::"+userId+"---PAYMENT AccountioD::"+accountId)
  
  try {
    if(userId != EMPTY_STRING && accountId != EMPTY_STRING && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      const costs = await prisma.expense.findMany({
        where: {
          category: {
            equals: ExpenseCategory.Cost
          },
          project: {
            accountId: {
              equals: parseInt(accountId.toString())
            }
          },
        
        },
        orderBy: {
          id: "desc"
        }
      });

      res.status(200).json(costs);
    } else if (accountId != "" && accountId != undefined && userId == "NaN"){
      const expenses = await prisma.expense.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          lastUpdateDate: "asc"
        }
      });
      res.status(200).json(expenses);

    }else if (userId != "" && userId != undefined && accountId == "NaN") {
      const expenses = await prisma.expense.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          lastUpdateDate: "asc"
        }
      });
      res.status(200).json(expenses);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
