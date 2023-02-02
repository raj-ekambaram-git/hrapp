import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";





export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {templateReqestData} = req.body;
    console.log("templateReqestData::"+JSON.stringify(templateReqestData))

    const savedTemplate = await prisma.exportTemplate.create({
      data: templateReqestData,
    });
    res.status(200).json(savedTemplate);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};
