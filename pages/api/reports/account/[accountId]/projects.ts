// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const vendorId = req.query.vendorId;
  const accountId = req.query.accountId;

console.log("Vendor ID::"+vendorId+"---AccountioD::"+accountId)
  
  try {
    if(vendorId != EMPTY_STRING && accountId != EMPTY_STRING && accountId != "NaN" && accountId != undefined && vendorId != undefined && vendorId != "NaN") {
      const projects = await prisma.project.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())            
            },
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
      });
      res.status(200).json(projects);
    } else if (accountId != EMPTY_STRING && accountId != undefined && accountId != "NaN" && (vendorId == "NaN" || vendorId == EMPTY_STRING || vendorId == null)){
      console.log("2222")
      const projects = await prisma.project.findMany({
        where: {
            accountId: {
              equals: parseInt(accountId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },
      });
      res.status(200).json(projects);

    }else if (vendorId != EMPTY_STRING && vendorId != undefined && (accountId == "NaN" || accountId == undefined || accountId == EMPTY_STRING)) {
      console.log("2222")
      const projects = await prisma.project.findMany({
        where: {
            vendorId: {
              equals: parseInt(vendorId.toString())
            }
        },
        orderBy: {
          id: "desc"
        },

      });

      res.status(200).json(projects);
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
