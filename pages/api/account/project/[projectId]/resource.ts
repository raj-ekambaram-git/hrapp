// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const projectId = req.query.projectId;
  const accountId = req.query.accountId;

console.log("projectId ID::"+projectId+"---AccountioD::"+accountId)
  
  try {
    if(projectId != EMPTY_STRING && projectId != undefined) {
      const projectResources = await prisma.projectResource.findMany({
        where: {
            projectId: {
              equals: parseInt(projectId.toString())            
            },
            
        },
        orderBy: {
          id: "desc"
        },
        include: {
          project: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      res.status(200).json(projectResources);
    }else {
      res.status(400).json({ message: 'Something went wrong while getting project resources' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while getting accounts' })
  }
}
