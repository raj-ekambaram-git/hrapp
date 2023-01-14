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

  enum DocumentStatus {
    Active = "Active",
    Inactive = "Inactive",
  }

  try {
    const type = req.query?.type;
    let documentTypeValue = DocumentType.Account;

    switch(type) {
      case DocumentType.Account:
        documentTypeValue = DocumentType.Account
        break;
      case DocumentType.Vendor:
        documentTypeValue = DocumentType.Vendor
        break
      case DocumentType.User:
        documentTypeValue = DocumentType.User
        break
      case DocumentType.Invoice:
        documentTypeValue = DocumentType.Invoice
        break
      case DocumentType.Project:
        documentTypeValue = DocumentType.Project
        break
    }

    const typeId = req.query?.typeId;

    console.log("TYPE:::"+documentTypeValue+"-----TYPE ID::"+typeId);
    const documents = await prisma.document.findMany({
      where: {
        typeId: parseInt(typeId.toString()),
        type: documentTypeValue,
        status: {
          in: [DocumentStatus.Active, DocumentStatus.Inactive]
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
