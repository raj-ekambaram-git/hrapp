// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";




export default async (req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }


  try {
    const {workFlowRequest} = req.body;
    const {workFlowStepsRequest} = req.body;
    const accountId = req.query.accountId;
    const workFlowId = req.query.accountId;

    const updatedWorkFlowStepsRequest = workFlowStepsRequest?.map((step, index) => {
      step.taskId = parseInt(step.taskId)
      step.assignedTo = parseInt(step.assignedTo)
      step.stepNumber = index+1
      return step;
    })

    if(accountId && workFlowRequest && workFlowId) {
      const savedWorkFlow = await prisma.workFlow.update({
        where: {            
          id: workFlowRequest.id
        },     
        data: {
          ...workFlowRequest,
          
          workFlowSteps: {
            deleteMany: {
              workFlowId: workFlowRequest.id,
              NOT: updatedWorkFlowStepsRequest?.map(({ id }) => ({ id })),
            },
            upsert: updatedWorkFlowStepsRequest?.map((wfStep) => ({ 
              where: { id: wfStep.id?wfStep.id:0 },
              create: {...wfStep},
              update: {...wfStep},
            }))
          }
        },
        include: {
          workFlowSteps: {
            select: {
              id: true,
              stepNumber: true,
              taskId: true,
              assignedTo: true,
              dueDate: true,
              status: true,
              completedDate: true
            },
            orderBy: {
              stepNumber: "asc"
            }
          },
          updatedUser: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      // const savedInvoice = await prisma.invoice.update({
      //   where: {
      //     id: invoice.invoiceData.id,
      //   },
      //   data: {
      //     ...invoice.invoiceData,
      //     invoiceItems: {
      //       deleteMany: {
      //         invoiceId: invoice.invoiceData.id,
      //         NOT: invoice.invoiceItems?.map(({ id }) => ({ id })),
      //       },
      //       upsert: invoice.invoiceItems?.map((invoiceItem) => ({ 
      //         where: { id: invoiceItem.id?invoiceItem.id:0 },
      //         create: {...invoiceItem},
      //         update: {...invoiceItem},
      //       }))
      //     },
      //   }
      // });      
      res.status(200).json(savedWorkFlow);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
