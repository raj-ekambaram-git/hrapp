// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { CommonConstants, EmailConstants } from "../../../constants";
import { util } from "../../../helpers/util";
import prisma from "../../../lib/prisma";
import { emailService, timesheetService } from "../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("timesheet create");
    const timesheet = req.body;

    console.log("timesheet cretion::"+JSON.stringify(timesheet))
    
    const saveTimesheet = await prisma.timesheet.create({
      data: timesheet,
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

    if(saveTimesheet && saveTimesheet.status === TimesheetStatus.Submitted) {
      saveTimesheet.timesheetEntries?.map((timesheetEntry) => {
        const emailResponse = emailService.sendEmail(timesheetService.getNewTimesheetEmailRequest(timesheetEntry, saveTimesheet));
        if(!emailResponse.error) {
          console.log("error happened sending email:::"+JSON.stringify(timesheetEntry))
        }
      })      
    }
    res.status(200).json(saveTimesheet);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
