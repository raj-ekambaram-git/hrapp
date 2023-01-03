// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING, TIMESHEET_STATUS } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  enum TimesheetStatus {
    Draft = "Draft",
    Saved = "Saved",
    Submitted = "Submitted",
    Approved = "Approved",
    Rejected = "Rejected",
    Invoiced= "Invoiced",
  }

  const projectId = req?.query?.projectId;
  const accountId = req?.query?.accountId;
  const status = req?.query?.status;
  let whereStatusValue = [TimesheetStatus.Draft];



  if(status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Pending) {
    whereStatusValue = [TimesheetStatus.Draft, TimesheetStatus.Saved, TimesheetStatus.Submitted, TimesheetStatus.Rejected]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Approved ) {
    whereStatusValue = [TimesheetStatus.Approved]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Invoiced) {
    whereStatusValue = [TimesheetStatus.Invoiced]
  } else if (status != undefined && status != EMPTY_STRING && status == TIMESHEET_STATUS.Rejected) {
    whereStatusValue = [TimesheetStatus.Rejected]
  }

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId+"--status::"+status)
  
  try {
    if(projectId != EMPTY_STRING && projectId != undefined && status != undefined && status != EMPTY_STRING && whereStatusValue != undefined) {
      const timesheetEntries = await prisma.timesheetEntries.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())
            },
            status: {
              in: whereStatusValue,
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

      console.log("PROJECT timesheetEntries::BY STTAUS :"+JSON.stringify(timesheetEntries))
      res.status(200).json(timesheetEntries);
    } else if(projectId != EMPTY_STRING && projectId != undefined) {

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
    }
    else {
      res.status(400).json({ message: 'Something went wrong while getting project resources' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
