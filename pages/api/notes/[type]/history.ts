// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../constants/accountConstants";
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

  enum NotesMode {
    New = "New",
    Reply = "Reply",
  }

  try {
    const type = req.query?.type;
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

    const typeId = req.query?.typeId;

    console.log("TYPE:::"+typeValue+"-----TYPE ID::"+typeId);
    const notesHistory = await prisma.notes.findMany({
      where: {
        typeId: parseInt(typeId.toString()),
        type: typeValue,
        mode: NotesMode.New

      },
      orderBy: {
        id: "desc"
      },
      include: {
        createdUser: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        replies: {
          select: {
            repliesRelation:{
              select: {
                id: true
              }
            },
            id: true,
            type: true,
            typeId: true,
            notes: true,
            createdUser: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    console.log("notesHistory:::"+JSON.stringify(notesHistory))
      res.status(200).json(notesHistory);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
