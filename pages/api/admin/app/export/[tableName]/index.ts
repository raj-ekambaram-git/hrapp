import { Prisma, TimesheetStatus, TimesheetType } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { EMPTY_STRING } from "../../../../../../constants";
import prisma from "../../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const tableName = req.query?.tableName;
    const {selectFields} = req.body;
    const {filterByList} = req.body;
    console.log("FIIIII :::"+JSON.stringify(filterByList))
    
    
    let whereClause = getWhereCluase(filterByList);

    console.log("whereClause:::"+whereClause)

    let quotedAndCommaSeparated = "\"" + selectFields.join("\",\"") + "\"";
    // const exportData = await prisma.$queryRawUnsafe(`${query};`);
    if(whereClause && whereClause != EMPTY_STRING) {
      console.log("Where Clause")
      const exportData = await prisma.$queryRaw`SELECT ${Prisma.raw(String(quotedAndCommaSeparated))} FROM ${Prisma.raw(JSON.stringify(tableName))} ${Prisma.raw(String(whereClause))};`;
      console.log("Where Export Data:::"+JSON.stringify(exportData))
      res.status(200).json(exportData);
  
    }else {
      const exportData = await prisma.$queryRaw`SELECT ${Prisma.raw(String(quotedAndCommaSeparated))} FROM ${Prisma.raw(JSON.stringify(tableName))};`;
      console.log("Export Data:::"+JSON.stringify(exportData))
      res.status(200).json(exportData);
  
    }
    
    // const exportData = await prisma.$queryRaw`SELECT "createdDate" FROM ${Prisma.raw(JSON.stringify(tableName))};`;
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

const getWhereCluase = (filterByList) => {
  let whereClause = EMPTY_STRING;
  filterByList.map((filterBy, index) => {
    if(index === 0) {
      if(filterBy.dataType === "text" || filterBy.dataType === "USER-DEFINED") {
        whereClause = " WHERE "+filterBy.key+filterBy.operator+"'"+filterBy.value+"'";
      }else {
        whereClause = " WHERE "+filterBy.key+filterBy.operator+filterBy.value;
      }
      
    }else {
      if(filterBy.dataType === "text" || filterBy.dataType === "USER-DEFINED") {
        whereClause = whereClause+ " AND "+filterBy.key+filterBy.operator+"'"+filterBy.value+"'";
      }else {
        whereClause = whereClause+ " AND "+filterBy.key+filterBy.operator+filterBy.value;
      }
    }
  })
  return whereClause;
}