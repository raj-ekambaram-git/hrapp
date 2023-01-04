// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheetEntry = req.body;
    // const savedAccount: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedTSEntry = await prisma.timesheetEntries.update({
      where: {
        id: timesheetEntry.id,
      },
      data: timesheetEntry,
      select: {
        timesheetId: true,
        timesheet: {
          select: {
            userId: true
          }
        }
      }
    });
    console.log("saved TimesheetEntry::"+JSON.stringify(savedTSEntry))
    res.status(200).json(savedTSEntry);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
