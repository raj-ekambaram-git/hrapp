// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { util } from "../../../../../helpers/util";
import prisma from "../../../../../lib/prisma";
import { emailService, timesheetService } from "../../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {timesheetEntryData} = req.body;
    const {timesheetUserId} = req.body;
    const {timesheetEntryNotes} = req.body;
    
    const savedTSEntry =  await prisma.$transaction(async (tx) => {
      const savedTSEntry = await prisma.timesheetEntries.update({
        where: {
          id: timesheetEntryData.id,
        },
        data: timesheetEntryData,
        select: {
          timesheetId: true,
          status: true,
          entries: true,
          unitPrice: true,
          projectId: true,
          project: {
            select: {
              usedBudget: true,
              projectResource: {
                where: {
                  userId: timesheetUserId,
                  billable: timesheetEntryData.billable
                }              
              }
            }
          },
          timesheet: {
            select: {
              userId: true,
              status: true,
              timesheetEntries: true
            }
          }
        }
      });

      let updaetTimesheetStatus = true;
      //Check if all the etntrie are approved or rejected, if its is, update the timesheet status to be the same
      savedTSEntry.timesheet?.timesheetEntries?.map((tsEntry) => {
          if(timesheetEntryData.status === TimesheetStatus.Approved && (tsEntry.status !== TimesheetStatus.Approved && tsEntry.status !== TimesheetStatus.Invoiced)) {
            updaetTimesheetStatus = false;
          }else if (timesheetEntryData.status === TimesheetStatus.Rejected && (tsEntry.status !== TimesheetStatus.Rejected)) {
            updaetTimesheetStatus = false;
          }
        }
      )
      if(updaetTimesheetStatus) {
        //Now update the timesheet with the status
        const savedTimesheet = await prisma.timesheet.update({
          where: {
            id: parseInt(savedTSEntry.timesheetId.toString()),
          },
          data: {status: timesheetEntryData.status},

        });
      }

      //Send email here 
      if(savedTSEntry && (savedTSEntry.status === TimesheetStatus.Approved || savedTSEntry.status === TimesheetStatus.Rejected)) {

          const tsEntryDetailsForEmail = await prisma.timesheetEntries.findUnique({
            where: {
              id: timesheetEntryData.id,
            },
            select: {
              status: true,          
              project: {
                select: {
                  name: true,
                  projectResource: {
                    where: {
                      isTimesheetApprover: true
                    },
                    select: {
                      user: {
                        select: {
                          email: true
                        }                        
                      }
                    }              
                  }
                }
              },
              timesheet: {
                select: {
                  name: true,
                  startDate: true,
                  user:{
                    select: {
                      email: true,
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              },
              approvedUser: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          });
          const authHeader = {Authorization: req.headers.authorization}
          const emailResponse = emailService.sendEmail(timesheetService.getTimesheetApprovalEmailRequest(tsEntryDetailsForEmail, tsEntryDetailsForEmail.timesheet, timesheetEntryNotes), authHeader);
          if(!emailResponse.error) {
            console.log("error happened sending email:::"+JSON.stringify(savedTSEntry))
          }              
      }

      return savedTSEntry;
    });

    
    console.log("saved TimesheetEntry::"+JSON.stringify(savedTSEntry))
    res.status(200).json(savedTSEntry);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
