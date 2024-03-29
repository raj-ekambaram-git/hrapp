// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NotesType, Role, UserStatus, VendorStatus, WorkFlowTaskStatus, WorkFlowType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const accountId = req.query?.accountId;
  const type = req.query?.type;
  const typeId = req.query?.typeId;
  console.log("TASKS Account ::"+accountId+"****typeId::"+typeId+"****type::"+type)
  try {
    if(accountId && type && typeId) {
      const workFlow = await prisma.workFlow.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            type: {
              equals: WorkFlowType[type.toString()]
            },
           typeId: {
            equals: parseInt(typeId.toString())
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
          }
        },
        orderBy: {
          lastUpdateDate: "asc"
        }
      });
      console.log("workFlow:::"+JSON.stringify(workFlow))
      res.status(200).json(workFlow[0]);
    } else {
      res.status(400).json({ message: 'Something went wrong while getting workflow type and tasks' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting workFlowTasks' })
  }
}
