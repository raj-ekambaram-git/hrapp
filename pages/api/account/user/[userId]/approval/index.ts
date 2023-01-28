// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ExpenseStatus, TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../../constants";
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.userId;
  const accountId = req.query.accountId;

console.log("userId ID::"+userId+"---AccountioD::"+accountId)
  
  try {
    if(userId != EMPTY_STRING && accountId != EMPTY_STRING && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
        const approvalData = {};
        const projects = await prisma.projectResource.findMany({
            where: {
                userId: parseInt(userId.toString()),
                isTimesheetApprover: true
            },
            select: {
                billable: true,
                project: {
                    select: {
                        name: true,
                        id: true,
                        timesheetEntries: {
                            where: {
                                status: TimesheetStatus.Submitted
                            },
                            select: {
                                id: true
                            }
                        },
                        expense: {
                            where: {
                                status: ExpenseStatus.Submitted
                            },
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });

        console.log("projects::"+JSON.stringify(projects))
      res.status(200).json(approvalData);
    } 

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting approval data' })
  }
}
