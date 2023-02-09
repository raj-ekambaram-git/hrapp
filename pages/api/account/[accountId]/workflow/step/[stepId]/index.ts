// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { InvoiceStatus, ProjectStatus, UserStatus, VendorStatus, WorkFlowStepStatus, WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {stepRequest} = req.body;
    const accountId = req.query.accountId;
    
    const savedStep = await prisma.workFlowStep.update({
      where: {
        id: stepRequest.id,
      },
      data: stepRequest,
      include: {
        workFlow: {
          select: {
            type: true,
            typeId: true,
            workFlowSteps: {
              where: {
                status: {
                  notIn: [WorkFlowStepStatus.Complete]
                }
              }
            }
          }
        }
      }      
    });

    console.log("savedStep:::"+JSON.stringify(savedStep))
    //Check if there are any more non completed items, if all are completed, go back and mark the type ID as Approved
    if(savedStep && savedStep.workFlow && savedStep.workFlow?.workFlowSteps && savedStep.workFlow?.workFlowSteps.length == 0) {

      if(savedStep.workFlow?.type === WorkFlowType.Vendor) {
        const savedVendor = await prisma.vendor.update({
          where: {
            id: parseInt(savedStep.workFlow?.typeId?.toString()),
          },
          data: {
            status: VendorStatus.Active
          }
        });
      } else if (savedStep.workFlow?.type === WorkFlowType.Project) {
        const savedProject = await prisma.project.update({
          where: {
            id: parseInt(savedStep.workFlow?.typeId?.toString()),
          },
          data: {
            status: ProjectStatus.Open
          }
        });        

      } else if (savedStep.workFlow?.type === WorkFlowType.User) {
        const savedUser = await prisma.user.update({
          where: {
            id: parseInt(savedStep.workFlow?.typeId?.toString()),
          },
          data: {
            status: UserStatus.Approved
          }
        });
      } else if (savedStep.workFlow?.type === WorkFlowType.Invoice) {
        const savedInvoice = await prisma.invoice.update({
          where: {
            id: parseInt(savedStep.workFlow?.typeId?.toString()),
          },
          data: {
            status: InvoiceStatus.Submitted
          }
        });
      }
    }
    res.status(200).json(savedStep);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating a workflow step.' })
  }
}
