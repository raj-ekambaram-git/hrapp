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
    

    //Update the timesheet entries first
    for (let i = 0; i < timesheet.timesheetEntries.length; i++) {
      console.log("inside the entries presenet..")
      let timesheetEntry = timesheet.timesheetEntries[i];

      console.log("timesheetEntry:::"+JSON.stringify(timesheetEntry));

      if(timesheetEntry.id && timesheetEntry.id != undefined && timesheetEntry.id != EMPTY_STRING) {
        console.log("ID Present:::"+timesheetEntry.id);
        //Update Timesheet Entry
        const savedTimesheetEntries = await prisma.timesheetEntries.update({
          where: {
            id: timesheetEntry.id,
          },
          data: timesheetEntry
          // data: {
          //   timesheetId: timesheet.id,
          //   status: timesheetEntry.status,
          //   projectId: timesheetEntry.projectId,
          //   approvedDate: timesheetEntry.approvedDate,
          //   entries: timesheetEntry.entries
          // }
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


    const savedTimesheet = await prisma.timesheet.update({
      where: {
        id: timesheet.id,
      },
      data: {
        name: timesheet.name,
        status: timesheet.status
      }
    });
    res.status(200).json(savedTimesheet);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
