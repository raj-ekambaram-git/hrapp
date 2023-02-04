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

console.log("userId ID::"+userId+"---PAYMENT AccountioD::"+accountId)
  
  try {
    if(userId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {

      const projects = await prisma.projectResource.findMany({
        select: {
          project: {
            select: {
              name: true,
              referenceCode: true,
              expense: {
                where: {
                  status: {
                    not: ExpenseStatus.MarkForDelete
                  }
                },
                select: {
                  id: true,
                  name: true,
                  status: true,
                  total: true,
                  paidAmount: true,
                  expenseEntries: true,
                  lastUpdateDate: true,
                  approvedDate: true,
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  },
                  approvedBy: {
                    select: {
                      firstName: true
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
            project: {
              expense: {
                some: {
                  status: {
                    in: [ExpenseStatus.Approved, ExpenseStatus.PartiallyPaid, ExpenseStatus.Invoiced]
                  },
                },
                
              },
              accountId: {
                equals: parseInt(accountId.toString())
              }
            }
            
        },
        orderBy: {
          id: "desc"
        }
      });


      res.status(200).json(projects);
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
