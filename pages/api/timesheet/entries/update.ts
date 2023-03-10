// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const tsEntriesUpdateRequest = req.body;

    if(tsEntriesUpdateRequest && tsEntriesUpdateRequest.data?.length>0) {
      const transactionResponse =  await prisma.$transaction(async (tx) => {
        const udpatedTSEntries = tsEntriesUpdateRequest.data.map(async tsEntry => {
          const savedTimesheetEntries = await prisma.timesheetEntries.update({
            where: {
              id: parseInt(tsEntry.id)
            },
            data: tsEntry
          });    
          if(savedTimesheetEntries) {
            return true;
          }      
        })
        return {success: true}
      })
  
      if(transactionResponse) {
        res.status(200).json({success: true});
      } else {
        res.status(400).json({ message: 'Something went wrong while updating' })
      }
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }

  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
