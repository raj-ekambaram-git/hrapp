// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tsEntriesUpdateRequest = req.body;
    console.log("tsEntriesUpdateRequest::"+JSON.stringify(tsEntriesUpdateRequest))
    const savedTimesheetEntries = await prisma.timesheetEntries.updateMany({
      where: {
        id: {
          in: tsEntriesUpdateRequest.tsIds
        }
      },
      data: tsEntriesUpdateRequest.data
    });
    res.status(200).json(savedTimesheetEntries);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
