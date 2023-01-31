import { TimesheetStatus, TimesheetType } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("REQUEST BIDY::"+JSON.stringify(req.body))
    const savedInvoice = await prisma.timesheet.upsert({
        where: {
          userId_name: {
            name: "MMMM",
            userId: parseInt("2")
          }
        },
        create: {
          name: "MMMM",
          status: TimesheetStatus.Saved,
          type: TimesheetType.Weekly,  
          userId: parseInt("2")        
        },
        update: {
          status: TimesheetStatus.Draft
        }
     });
    res.status(200).json(savedInvoice);

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

