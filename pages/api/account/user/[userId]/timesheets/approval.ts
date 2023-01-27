// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.userId;
  const accountId = req.query.accountId;

console.log("userId ID::"+userId+"---AccountioD::"+accountId)
  
  try {
    if(userId != "" && accountId != "" && accountId != "NaN" && accountId != undefined && userId != undefined && userId != "NaN") {
      const projects = await prisma.projectResource.findMany({
        select: {
          project: {
            select: {
              name: true,
              referenceCode: true,
              timesheetEntries: {
                where: {
                  status: {
                    not: TimesheetStatus.MarkForDelete
                  }
                },
                select: {
                  id: true,
                  status: true,
                  entries: true,
                  lastUpdateDate: true,
                  billable: true,
                  timesheet: {
                    select: {
                      name: true,
                      userId: true,
                      user: {
                        select: {
                          firstName: true,
                          lastName: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        where: {
            userId: {
              equals: parseInt(userId.toString())
            },
            isTimesheetApprover: {
              equals: true
            },
            billable: true,
            project: {
              timesheetEntries: {
                some: {
                  status: "Submitted"
                }
              }
            }
            
        },
        orderBy: {
          id: "desc"
        }
      });

      res.status(200).json(projects);
    } else if (accountId != "" && accountId != undefined && userId == "NaN"){
      const timesheets = await prisma.timesheet.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          lastUpdateDate: "asc"
        }
      });
      res.status(200).json(timesheets);

    }else if (userId != "" && userId != undefined && accountId == "NaN") {
      const timesheets = await prisma.timesheet.findMany({
        where: {
            userId: {
              equals: parseInt(userId.toString())            
            }
        },
        orderBy: {
          lastUpdateDate: "asc"
        }
      });
      res.status(200).json(timesheets);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
