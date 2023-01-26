// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoiceId = req.query?.invoiceId;
    const accountId = req.query?.accountId;
    
    if(invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
          id: {
            equals: parseInt(invoiceId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          },
          status: {
            not: InvoiceStatus.MarkForDelete
          }
      },
        include: {
          invoiceItems: {
            select: {
              id: true,
              description: true,
              type: true,
              unitPrice: true,
              currency: true,
              quantity: true,
              uom: true,
              total: true,
              status: true,
              userId: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              },
              timesheetEntryId: true,
              expenseId: true,
              expense: {
                select: {
                  id: true,
                  status: true,
                  expenseEntries: true
                }
              },
              timesheetEntry: {
                select: {
                  id: true,
                  status: true,
                  entries: true,
                  unitPrice: true
                }
              },
              fromDate: true,
              toDate: true

            }
          },
          vendor: {
            select: {
              id: true,
              name: true
            }
          },
          project: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      })
        console.log("invoices::::"+JSON.stringify(invoices))
        res.status(200).json(invoices[0]);
  
    } else if (invoiceId != "" && invoiceId != undefined && accountId != "" && accountId != undefined && accountId == "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
          id: {
            equals: parseInt(invoiceId.toString())            
          }
      },
        include: {
          vendor: {
            select: {
              id: true,
              name: true
            }
          },
          project: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }      
        }
      })
        res.status(200).json(invoices[0]);
  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
