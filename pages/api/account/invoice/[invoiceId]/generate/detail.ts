// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

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
          }
      },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              address: {
                where: {
                  vendorId: null,
                  userId: null
                }
              }
            },
          },
          invoiceItems: {
            select: {
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
              name: true,
              email: true,
              address: {
                where: {
                  accountId: parseInt(accountId.toString()),
                  userId: null
                }
              }
            }
          },
          project: {
            select: {
              id: true,
              name: true,
              referenceCode: true
            }
          }
        }
      })
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
              name: true
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
