import { ExportTemplateType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const templateName = req.query?.templateName;
    const templateType = req.query?.templateType;
    console.log("templateName::"+JSON.stringify(templateName)+"****templateType::"+templateType)

    if(templateName && templateType) {

      const savedTemplates = await prisma.exportTemplate.findMany({
        where: {
          name: templateName.toString(),
          type: templateType.toString() === "System"?ExportTemplateType.System:ExportTemplateType.User
        }
      });
      if(savedTemplates) {
        res.status(200).json(savedTemplates[0]);
      } else {
        res.status(400).json({ message: "Not able to fetch the templates." });  
      }
      
  
    } else {
      res.status(400).json({ message: "Not able to fetch the templates." });  
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }

};
