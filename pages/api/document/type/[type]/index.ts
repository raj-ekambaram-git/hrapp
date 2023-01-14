// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { DocumentConstants } from "../../../../../constants";
import { EMPTY_STRING } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  enum DocumentType {
    Timesheet = "Timesheet",
    TimesheetEntry = "TimesheetEntry",
    Account = "Account",
    Invoice = "Invoice",
    Project = "Project",
    User = "User",
    Vendor = "Vendor"
  }


  try {
    const type = req.query?.type;
    let typeValue = DocumentType.Timesheet;

    switch(type) {
      case DocumentType.Timesheet: 
        typeValue = DocumentType.Timesheet;
      break;
      case DocumentType.TimesheetEntry: 
      typeValue = DocumentType.TimesheetEntry;
      break;
      case DocumentType.Account: 
        typeValue = DocumentType.Account;
      break;
      case DocumentType.Vendor: 
        typeValue = DocumentType.Vendor;
      break;
      case DocumentType.Invoice: 
        typeValue = DocumentType.Invoice;
      break;
      case DocumentType.Project: 
        typeValue = DocumentType.Project;
      break;
      case DocumentType.User: 
        typeValue = DocumentType.User;
      break;
    }

    const typeId = req.query?.typeId;

    console.log("TYPE:::"+typeValue+"-----TYPE ID::"+typeId);
    const documents = await prisma.document.findMany({
      where: {
        typeId: parseInt(typeId.toString()),
        type: DocumentType.Vendor,
        status: {
          in: [DocumentConstants.DOCUMENT_STATUS.Active, DocumentConstants.DOCUMENT_STATUS.Inactive]
        }
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
        }
      }
    })

    console.log("documents:::"+JSON.stringify(documents))
      res.status(200).json(documents);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
