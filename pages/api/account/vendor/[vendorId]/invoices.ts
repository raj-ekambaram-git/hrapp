// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const vendorId = req.query.vendorId;
  const accountId = req.query.accountId;

console.log("Vendor ID::"+vendorId+"---AccountioD::"+accountId)
  
  try {
    if(vendorId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && vendorId != undefined) {
      const invoices = await prisma.invoice.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: InvoiceStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true,
          project: {
            select: {
              name: true
            }
          }
        }
      });
      res.status(200).json(invoices);
    } else if (accountId != "" && accountId != undefined && vendorId == ""){
      console.log("2222")
      const invoices = await prisma.invoice.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: InvoiceStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });
      res.status(200).json(invoices);

    }else if (vendorId != "" && vendorId != undefined && accountId == "NaN") {
      const invoices = await prisma.invoice.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())
            },
            status: {
              not: InvoiceStatus.MarkForDelete
            }
        },
        orderBy: {
          id: "desc"
        },
        include: {
          vendor: true,
          account: true
        }

      });

      res.status(200).json(invoices);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
