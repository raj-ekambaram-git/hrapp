// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import {EMPTY_STRING} from "../../../../constants/accountConstants";
import { TimesheetStatus } from "@prisma/client";
import { emailService, timesheetService } from "../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheet = req.body;

    console.log("Timesheet Data:::"+JSON.stringify(timesheet));
    
    const savedTimesheet = await prisma.timesheet.update({
      where: {
        id: timesheet.id,
      },
      data: {
        status: timesheet.status,
        timesheetEntries: {
          deleteMany: {
            timesheetId: timesheet.id,
            NOT: timesheet.timesheetEntries?.map(({ id }) => ({ id })),
          },
          upsert: timesheet.timesheetEntries?.map((timesheetEntry) => ({ 
            where: { id: timesheetEntry.id?timesheetEntry.id:0 },
            create: {...timesheetEntry},
            update: {...timesheetEntry},
          }))          
        }
      },
      include: {        
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          },          
        },        
        timesheetEntries: {
          select: {
            entries: true,
            project: {
              select: {
                name: true,
                contactEmail: true,
                projectResource: {
                  where: {
                    isTimesheetApprover: true,                    
                  },
                  select: {
                    user: {
                      select: {
                        email: true
                      }
                    }
                  }
                },
                vendor: {
                  select: {
                    email: true,
                    accountContactEmail: true
                  }
                }
              }
            },
          }
        },        
      }
    });

    if(savedTimesheet && savedTimesheet.status === TimesheetStatus.Submitted) {
      savedTimesheet.timesheetEntries?.map((timesheetEntry) => {
        const authHeader = {Authorization: req.headers.authorization}
        const emailResponse = emailService.sendEmail(timesheetService.getNewTimesheetEmailRequest(timesheetEntry, savedTimesheet), authHeader);
        if(!emailResponse.error) {
          console.log("error happened sending email:::"+JSON.stringify(timesheetEntry))
        }
      })      
    }

    res.status(200).json(savedTimesheet);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
