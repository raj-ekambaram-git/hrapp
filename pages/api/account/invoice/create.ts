// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import {  InvoiceConstants } from "../../../../constants";
import prisma from "../../../../lib/prisma";
import { invoiceService } from "../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  
  try {
    const invoice = req.body;
    
    const savedInvoice = await prisma.invoice.create({
      data: invoice.createData,
      include: InvoiceConstants.INVOICE_DETAIL_TO_GENERATE_FILE.include
    });
    if(savedInvoice && savedInvoice.workFlowEnabled && invoice.workFlow) {
      //Now persist the workflow data
      const steps = invoice.workFlow?.steps?.map((step, index) => {
        step.taskId = parseInt(step.taskId)
        step.assignedTo = parseInt(step.assignedTo)
        step.stepNumber = index+1
        return step;
      })
      const savedWorkFlow = await prisma.workFlow.create({
        data: {
          type: WorkFlowType.Invoice,
          typeId: savedInvoice.id,
          accountId: savedInvoice.accountId,
          name: invoice.workFlow.name,
          status: invoice.workFlow.status,
          updatedBy: invoice.workFlow.userId,
          workFlowSteps: {
            create: steps
          }
        }
      });
    }

    res.status(200).json(savedInvoice);
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong' })
  }
}
