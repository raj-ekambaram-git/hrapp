// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
import { userService } from "../../../../../services";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheetName = req.query?.name;
    const userId = req.query?.userId;

    console.log("timesheetName::"+timesheetName+"---accountId::"+userId+"--- USerValue::"+JSON.stringify(userService.user));
    
    if(timesheetName != "" && timesheetName != undefined && userId != "" && userId != undefined && userId != "NaN") {
      const timesheets = await prisma.timesheet.findMany({
        where: {
          name: {
            equals: timesheetName.toString()
          },
          userId: {
            equals: parseInt(userId)
          }
      }
      })
      
        res.status(200).json(timesheets);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
