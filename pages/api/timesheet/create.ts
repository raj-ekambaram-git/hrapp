// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("timesheet create");
    const timesheet = req.body;

    console.log("timesheet cretion::"+JSON.stringify(timesheet))
    
    const saveTimesheet = await prisma.timesheet.create({
      data: timesheet
    });
    res.status(200).json(saveTimesheet);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while saving account' })
  }
}
