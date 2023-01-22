// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TimesheetStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheetEntry = req.body;
    const savedTSEntry =  await prisma.$transaction(async (tx) => {
      const savedTSEntry = await prisma.timesheetEntries.update({
        where: {
          id: timesheetEntry.id,
        },
        data: timesheetEntry,
        select: {
          timesheetId: true,
          entries: true,
          unitPrice: true,
          projectId: true,
          project: {
            select: {
              usedBudget: true
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

      console.log("saved TimesheetEntry::"+JSON.stringify(savedTSEntry))

      let updaetTimesheetStatus = true;
      //Check if all the etntrie are approved or rejected, if its is, update the timesheet status to be the same
      savedTSEntry.timesheet?.timesheetEntries?.map((tsEntry) => {
          console.log("TSEntry:::"+JSON.stringify(tsEntry))
          if(timesheetEntry.status === TimesheetStatus.Approved && (tsEntry.status !== TimesheetStatus.Approved && tsEntry.status !== TimesheetStatus.Invoiced)) {
            updaetTimesheetStatus = false;
          }else if (timesheetEntry.status === TimesheetStatus.Rejected && (tsEntry.status !== TimesheetStatus.Rejected)) {
            updaetTimesheetStatus = false;
          }
        }
      )
      console.log("updaetTimesheetStatus:::"+updaetTimesheetStatus)
      if(updaetTimesheetStatus) {
        //Now update the timesheet with the status
        const savedTimesheet = await prisma.timesheet.update({
          where: {
            id: parseInt(savedTSEntry.timesheetId.toString()),
          },
          data: {status: timesheetEntry.status},

        });
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
