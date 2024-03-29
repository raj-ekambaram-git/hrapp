// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { VendorStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const accountId = req.query.accountId;
  console.log("Account ::"+accountId)
  try {
      const workFlowTasks = await prisma.workFlowTask.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            },
            status: {
              not: VendorStatus.MarkForDelete
            }
        },
        include: {
          updatedUser: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          lastUpdateDate: "desc"
        }
      });
      res.status(200).json(workFlowTasks);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting workFlowTasks' })
  }
}
