// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  enum NotesType {
    Expense = "Expense",
    ExpenseEntry = "ExpenseEntry",
    Timesheet = "Timesheet",
    TimesheetEntry = "TimesheetEntry",
    Account = "Account",
    Invoice = "Invoice",
    Project = "Project",
    User = "User",
    Vendor = "Vendor",
    WorkFlowTask = "WorkFlowTask",
  }

  enum NotesMode {
    New = "New",
    Reply = "Reply",
  }

  try {
    const type = req.query?.type;
    let typeValue = NotesType.Timesheet;

    switch(type) {
      case NotesType.Expense: 
        typeValue = NotesType.Expense;
      break;
      case NotesType.ExpenseEntry: 
        typeValue = NotesType.ExpenseEntry;
      break;
      case NotesType.Timesheet: 
        typeValue = NotesType.Timesheet;
      break;
      case NotesType.TimesheetEntry: 
      typeValue = NotesType.TimesheetEntry;
      break;
      case NotesType.Account: 
        typeValue = NotesType.Account;
      break;
      case NotesType.Vendor: 
        typeValue = NotesType.Vendor;
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
      case NotesType.WorkFlowTask: 
        typeValue = NotesType.WorkFlowTask;
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
          orderBy: {
            id: "desc"
          },
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
            lastUpdateDate: true,
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

      res.status(200).json(notesHistory);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
