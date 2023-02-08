// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NotesType, Role, UserStatus, VendorStatus, WorkFlowTaskStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const accountId = req.query?.accountId;
  const type = req.query?.type;
  console.log("TASKS Account ::"+accountId)
  try {
    if(accountId && type) {
      const workFlowTasks = await prisma.workFlowTask.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            type: {
              equals: NotesType[type.toString()]
            },
            status: {
              equals: WorkFlowTaskStatus.Active
            }

        },
        orderBy: {
          lastUpdateDate: "desc"
        }

      });
      res.status(200).json(workFlowTasks);
    } else {
      res.status(400).json({ message: 'Something went wrong while getting workflow type and tasks' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting workFlowTasks' })
  }
}
