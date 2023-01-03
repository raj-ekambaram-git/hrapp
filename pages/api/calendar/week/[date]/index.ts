// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const date = req.query?.date;

  console.log("date:::"+date);
  try {
    const currentWeek = await prisma.calendar.findUnique({
      where: {
        //dateDimId: parseBigInt(today.getFullYear()+(String(today.getMonth()+1).padStart(2, "0"))+String(today.getDate()+1).padStart(2, "0")),
        dateDimId: parseInt(date.toString())
      },
      select: {
        dateDimId: true,
        dayName: true,
        currentWeekDates: true,
        firstDayOfWeek: true,
        weekOfYearISO: true
      }
      
    })

    console.log("currentWeek:::"+JSON.stringify(currentWeek));
    res.status(200).json(currentWeek);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}


