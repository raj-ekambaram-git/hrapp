// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus, TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projectId = req.query?.projectId;
    const accountId = req.query?.accountId;
    
    if(projectId != EMPTY_STRING && projectId != undefined && accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
      const vendors = await prisma.project.findMany({
        where: {
          id: {
            equals: parseInt(projectId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          }
        },
        include: {
          projectResource: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
          invoice: {
            where: {
              status: {
                in: [InvoiceStatus.Paid, InvoiceStatus.PartiallyPaid, InvoiceStatus.Submitted]
              }
            },
            select: {
              total: true,
              paidAmount: true,
              status: true,
              invoiceItems: {
                select: {
                  userId: true,
                  total: true,
                  status: true,
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          },
          expense: {
            select: {
              total: true,
              paidAmount: true,
              userId: true,
              status: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              },
              expenseEntries: {
                select: {
                  billable: true,
                  amount: true
                }
              }
            }
          },          
          timesheetEntries:{
            where: {
              status: TimesheetStatus.Approved
            },
            select: {
              entries: true,
              unitPrice: true,
              timesheet: {
                select: {
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
        }
      })
      
        res.status(200).json(vendors[0]);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
