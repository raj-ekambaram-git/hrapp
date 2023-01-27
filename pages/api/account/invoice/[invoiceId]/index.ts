// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
import update from "../../../timesheet/entries/status/update";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoice = req.body;

    console.log("invoice UPDATE::"+JSON.stringify(invoice))
    //First Delete all the invoice items and recreate them below
    // const deletedInvoiceItems = await prisma.invoiceItem.deleteMany({
    //   where: {
    //     invoiceId: invoice.id
    //   }
    // });

    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    if(invoice.skipInvoiceItemsUpdate) {
      const savedInvoice = await prisma.invoice.update({
        where: {
          id: invoice.invoiceData.id,
        },
        data: {
          ...invoice.invoiceData,
        }
      });
      res.status(200).json(savedInvoice);

    }else {
      const savedInvoice = await prisma.invoice.update({
        where: {
          id: invoice.invoiceData.id,
        },
        data: {
          ...invoice.invoiceData,
          invoiceItems: {
            deleteMany: {
              invoiceId: invoice.invoiceData.id,
              NOT: invoice.invoiceItems?.map(({ id }) => ({ id })),
            },
            upsert: invoice.invoiceItems?.map((invoiceItem) => ({ 
              where: { id: invoiceItem.id?invoiceItem.id:0 },
              create: {...invoiceItem},
              update: {...invoiceItem},
            }))
          },
        }
      });
      res.status(200).json(savedInvoice);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
