// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  enum NotesType {
    Timesheet = "Timesheet",
    Account = "Account",
    Invoice = "Invoice",
    Project = "Project",
    User = "User"
  }

 

  try {
    const notesId = req.query?.notesId;
    const type = req.query?.type;
    const typeId = req.query?.typeId;

    let typeValue = NotesType.Timesheet;
  
    switch(type) {
      case NotesType.Timesheet: 
        typeValue = NotesType.Timesheet;
      break;
      case NotesType.Account: 
        typeValue = NotesType.Account;
      break;
      case NotesType.Invoice: 
        typeValue = NotesType.Invoice;
      break;
      case NotesType.Project: 
        typeValue = NotesType.Project;
      break;
      case NotesType.User: 
        typeValue = NotesType.User;
      break;
    }
    console.log("notesId:::"+notesId+"-----notesType::");
    const notesHistory = await prisma.notes.findFirst({
      where: {
        id: parseInt(notesId.toString()),
        type: typeValue,
        typeId: parseInt(typeId.toString())

      },
      include: {
        createdUser: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        replies: true
      }
    })

    console.log("notesHistory:::"+JSON.stringify(notesHistory))
      res.status(200).json(notesHistory);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
