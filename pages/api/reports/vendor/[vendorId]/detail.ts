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
    const vendorId = req.query?.vendorId;
    const accountId = req.query?.accountId;
    
    if(vendorId != EMPTY_STRING && vendorId != undefined && accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN") {
      const vendors = await prisma.vendor.findMany({
        where: {
          id: {
            equals: parseInt(vendorId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          }
      },
        include: {
          project: {
           select: {
              id: true,
              name: true,
              status: true,
              referenceCode: true,
              usedBudget: true,
              usedMiscBudget: true,
              miscBudget: true,
              budget: true,
              projectResource: {
                where: {
                  billable: {
                    equals: true
                  }
                },
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    }
                  },
                  userId: true,
                  budgetAllocated: true,
                  usedBudget: true,
                  unitPrice: true,
                  cost: true,
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
                      type: true,
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
          },
          vendorUsers: {
            select: {
              id: true,
              vendorId: true,
              status: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  status: true,
                  phone: true,
                  userRole: true
                }
              }
            }
          }
        }
      })      
      res.status(200).json(vendors[0]);  
    } 
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
