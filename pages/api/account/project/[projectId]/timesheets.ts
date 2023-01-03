// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req.query.projectId;
  const accountId = req.query.accountId;

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId)
  
  try {
    if(projectId != EMPTY_STRING && projectId != undefined) {
      const timesheetEntries = await prisma.timesheetEntries.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
       include: {
        approvedUser: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        timesheet: {
          select: {
            name: true,
            status: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
       }
      });

      console.log("PROJECT timesheetEntries:::"+JSON.stringify(timesheetEntries))
      res.status(200).json(timesheetEntries);
    }else {
      res.status(400).json({ message: 'Something went wrong while getting project resources' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
