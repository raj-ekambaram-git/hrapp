import { Prisma, TimesheetStatus, TimesheetType } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { EMPTY_STRING } from "../../../../../../constants";
import prisma from "../../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // const tableName = req.query?.tableName
    // const tableName = "\""+req.query?.tableName+"\" as "+req.query?.tableName?.toString().toLowerCase()
    // const tableName = getFromTable(req.query?.tableName)
    
    const {tableName} = req.body;
    const {selectFields} = req.body;
    const {filterByList} = req.body;
    const {joinsList} = req.body;
    const {accountId} = req.body;

    
    let tableNames =  getFromTable(tableName)
    let whereClause = getWhereClause(filterByList, joinsList);
    let selectFieldValue = getSelectFields(selectFields);

    // const exportData = await prisma.$queryRawUnsafe(`${query};`);
    if(whereClause && whereClause != EMPTY_STRING) {
      console.log("BEFORE CALLING EXPORT 1111::selectFieldValue::"+selectFieldValue+"*****tableNames:::"+tableNames+"***whereClause::"+whereClause)
      const exportData = await prisma.$queryRaw`SELECT ${Prisma.raw(String(selectFieldValue))} FROM ${Prisma.raw(tableNames)}  ${Prisma.raw(String(whereClause))};`;
      console.log("Where Export Data:::"+JSON.stringify(exportData))
      res.status(200).json(exportData);
  
    }else {
      console.log("BEFORE CALLING EXPORT 222222::selectFieldValue::"+selectFieldValue+"*****tableNames:::"+tableNames+"***whereClause::"+whereClause)
      const exportData = await prisma.$queryRaw`SELECT ${Prisma.raw(String(selectFieldValue))} FROM ${Prisma.raw(JSON.stringify(tableNames))};`;
      console.log("Export Data:::"+JSON.stringify(exportData))
      res.status(200).json(exportData);
  
    }
    
    // const exportData = await prisma.$queryRaw`SELECT "createdDate" FROM ${Prisma.raw(JSON.stringify(tableName))};`;
    
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

const getFromTable = (fromTable) => {
  console.log("tableName:::"+JSON.stringify(fromTable))
  const quotedAndCommaSeparated = fromTable.map((tableName) => {
    console.log("INSIDDEE::"+tableName)

    return "\""+tableName+"\" as "+(tableName?.toString().toLowerCase() === "user"?"usr":tableName?.toString().toLowerCase())
    // console.log("selectField:::"+tableName.split(".")[0]+"******"+tableName.split(".")[1])
    // return tableName.split(".")[0]+"."+"\""+tableName.split(".")[1]+"\""
  })

  console.log("getFromTable::::quotedAndCommaSeparated::"+quotedAndCommaSeparated)

  // const tableName = "\""+fromTable+"\" as "+fromTable?.toString().toLowerCase()
  // console.log("tableName:::"+tableName)
  return quotedAndCommaSeparated;
}

const getSelectFields = (selectFields) => {
  const quotedAndCommaSeparated = selectFields?.map((selectField) => {
    console.log("selectField:::"+selectField.split(".")[0]+"******"+selectField.split(".")[1])
    return selectField.split(".")[0]+"."+"\""+selectField.split(".")[1]+"\""+" as "+selectField.split(".")[0]+selectField.split(".")[1]
  })

  // let quotedAndCommaSeparated = "\"" + selectFields.join("\",\"") + "\"";

  console.log("quotedAndCommaSeparated::::"+quotedAndCommaSeparated)

  return quotedAndCommaSeparated;

}

const getWhereClause = (filterByList, joinsList) => {
  let whereClause = EMPTY_STRING;
  filterByList.map((filterBy, index) => {
    if(index === 0) {
      if(filterBy.dataType === "text" || filterBy.dataType === "USER-DEFINED") {
        whereClause = " WHERE "+filterBy.key?.split(".")[0]+".\""+filterBy.key?.split(".")[1]+"\""+filterBy.operator+"'"+filterBy.value+"'";
      }else {
        whereClause = " WHERE "+filterBy.key?.split(".")[0]+".\""+filterBy.key?.split(".")[1]+"\""+filterBy.operator+filterBy.value;
      }
      
    }else {
      if(filterBy.dataType === "text" || filterBy.dataType === "USER-DEFINED") {
        whereClause = whereClause+ " AND "+filterBy.key?.split(".")[0]+".\""+filterBy.key?.split(".")[1]+"\""+filterBy.operator+"'"+filterBy.value+"'";
      }else {
        whereClause = whereClause+ " AND "+filterBy.key?.split(".")[0]+".\""+filterBy.key?.split(".")[1]+"\""+filterBy.operator+filterBy.value;
      }
    }
  })

  console.log("joinsListjoinsList::"+joinsList)

  joinsList?.map((joins, index) => {
    const leftSide = joins.split("=")[0]?.split(".")[0]+"."+"\""+joins.split("=")[0]?.split(".")[1]+"\""
    const rigthSide = joins.split("=")[1]?.split(".")[0]+"."+"\""+joins.split("=")[1]?.split(".")[1]+"\""

    if(index === 0 && whereClause === EMPTY_STRING) {      
      whereClause = " WHERE "+leftSide+"="+rigthSide;
    }else {
      whereClause = whereClause+ " AND "+" "+leftSide+"="+rigthSide;
    }
  })
  console.log("WHERE CLAUSE::"+whereClause)
  // joinsList.map((join, index) => {
  //   if(index === 0 && whereClause === EMPTY_STRING) {
  //   }else {

  //   }
  // })
  return whereClause;
}