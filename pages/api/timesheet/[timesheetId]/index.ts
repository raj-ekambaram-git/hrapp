// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";
import {EMPTY_STRING} from "../../../../constants/accountConstants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheet = req.body;

    console.log("Timesheet Data:::"+JSON.stringify(timesheet));
    
    let timesheetEntryStatus = EMPTY_STRING;
    let updateTimesheetStatus = false;
    //Update the timesheet entries first
    for (let i = 0; i < timesheet.timesheetEntries.length; i++) {
      console.log("inside the entries presenet..")
      let timesheetEntry = timesheet.timesheetEntries[i];
      timesheetEntryStatus = timesheetEntry.status;
      if(timesheetEntryStatus === EMPTY_STRING || timesheetEntry.status === timesheetEntryStatus) {
        timesheetEntryStatus = timesheetEntry.status;
        updateTimesheetStatus = true;
      }else {
        updateTimesheetStatus = false;
      }

      console.log("timesheetEntryStatus:::"+JSON.stringify(timesheetEntryStatus));

      if(timesheetEntry.id && timesheetEntry.id != undefined && timesheetEntry.id != EMPTY_STRING) {
        console.log("ID Present:::"+timesheetEntry.id);
        //Update Timesheet Entry
        const savedTimesheetEntries = await prisma.timesheetEntries.update({
          where: {
            id: timesheetEntry.id,
          },
          data: timesheetEntry
        });        

      }else {
        console.log("Inside the creeate...")
        //Create Timesheet Entry
        timesheetEntry.timesheetId = timesheet.id;

        console.log("Inside new entry of timesheetentry:::"+JSON.stringify(timesheetEntry));
        const savedTimesheetEntries = await prisma.timesheetEntries.create({
          data: timesheetEntry
        });
        // res.status(200).json(savedTimesheetEntries);
      }
  }


    //TImesheet status calculation
    let timesheetStatus = timesheet.status;
    if(updateTimesheetStatus) {
      timesheetStatus = timesheetEntryStatus;
    }
    const savedTimesheet = await prisma.timesheet.update({
      where: {
        id: timesheet.id,
      },
      data: {
        name: timesheet.name,
        status: timesheetStatus
      }
    });
    res.status(200).json(savedTimesheet);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
