import { Prisma, TimesheetStatus, TimesheetType } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const tableName = req.query?.tableName;
    const {selectFields} = req.body;
    
    console.log("selectFields::"+String(selectFields))
    // const exportData = await prisma.$queryRawUnsafe(`${query};`);
    const exportData = await prisma.$queryRaw`SELECT ${Prisma.raw(String(selectFields))} FROM ${Prisma.raw(JSON.stringify(tableName))};`;
    console.log("Export Data:::"+JSON.stringify(exportData))
    res.status(200).json(exportData);
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

