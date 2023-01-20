// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const timesheetId = req.query?.timesheetId;
    const accountId = req.query?.accountId;
    
    if(timesheetId != "" && timesheetId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const vendors = await prisma.timesheet.findMany({
        where: {
          id: {
            equals: parseInt(timesheetId.toString())            
          },
      },
        include: {
          timesheetEntries: {
            select: {
              id: true,
              projectId: true,
              status: true,
              approvedBy: true,
              approvedDate: true,
              entries: true,
              unitPrice: true,
              notesRequired: true
            }
          }
        }
      })
      
        res.status(200).json(vendors[0]);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
