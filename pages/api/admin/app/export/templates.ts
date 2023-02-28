import { ExportTemplateType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const accountId = req.query?.accountId;
    const exportData = req.query?.exportData;
    console.log("accountId::"+JSON.stringify(accountId)+"****exportData::"+exportData)

    if(accountId && accountId != EMPTY_STRING) {

      const whereClause = {
        OR: [
          {
            type: {
              equals: ExportTemplateType.System,              
            }
          },            
         {
          accountId: {
            equals: parseInt(accountId.toString())
          }
         }
        ],        
      }

      if(exportData && exportData === "true") {
        whereClause["schedule"] =  false;
      }

      console.log("whereClause:::"+JSON.stringify(whereClause))

      const savedTemplates = await prisma.exportTemplate.findMany({
        where: whereClause
      });
      res.status(200).json(savedTemplates);
  
    } else {
      res.status(400).json({ message: "Not able to fetch the templates." });  
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
