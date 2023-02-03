// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ProjectStatus, TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../../constants";
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query?.userId;
  const accountId = req.query?.accountId;

console.log("userId ID::"+userId+"---AccountioD::"+accountId+"***")
  
  try {
    if(userId != EMPTY_STRING && accountId != EMPTY_STRING && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      const projects = await prisma.projectResource.findMany({
          where: {
            userId: parseInt(userId.toString()),
            project: {
              accountId: parseInt(accountId.toString()),
              status: {
                in: [ProjectStatus.Open, ProjectStatus.Created]
              }
            }
          },
          select: {
            usedBudget: true,
            budgetAllocated: true,
            project: {
              select: {
                name: true,
                referenceCode: true
              }
            }
          }
      });
      res.status(200).json(projects);
    } else {
      res.status(400).json({ message: 'Something went wrong while getting project progress' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
