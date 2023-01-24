// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.userId;
  const accountId = req.query.accountId;

console.log("userId ID::"+userId+"---AccountioD::"+accountId)
  
  try {
    if(userId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      console.log("11111");
      const projects = await prisma.projectResource.findMany({
        select: {
          project: {
            select: {
              name: true,
              referenceCode: true,
              expense: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                  total: true,
                  expenseEntries: true,
                  lastUpdateDate: true,
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          }
        },
        where: {
            userId: {
              equals: parseInt(userId.toString())
            },
            isTimesheetApprover: {
              equals: true
            },
            billable: true,
            project: {
              expense: {
                some: {
                  status: ExpenseStatus.Submitted
                }
              }
            }
            
        },
        orderBy: {
          id: "desc"
        }
      });

      console.log("PROJECTS:::"+JSON.stringify(projects));
      res.status(200).json(projects);
    } else if (accountId != "" && accountId != undefined && userId == "NaN"){
      console.log("2222");
      const expenses = await prisma.expense.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          id: "desc"
        }
      });
      res.status(200).json(expenses);

    }else if (userId != "" && userId != undefined && accountId == "NaN") {
      console.log("33333333");
      const expenses = await prisma.expense.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          id: "desc"
        }
      });
      res.status(200).json(expenses);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
