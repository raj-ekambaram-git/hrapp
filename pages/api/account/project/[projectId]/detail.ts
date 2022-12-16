// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projectId = req.query?.projectId;
    const accountId = req.query?.accountId;
    console.log("projectId:::"+projectId+"accountId:::"+accountId)
    if(projectId != "" && projectId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      console.log("111111")
      const projects = await prisma.project.findMany({
        where: {
          id: {
            equals: parseInt(projectId.toString())            
          },
          accountId: {
            equals: parseInt(accountId.toString())
          }
      },
        include: {
          address: true,
          account: true,
          vendor: true
        }
      })

      console.log("111111  projects[0]::"+JSON.stringify(projects[0]))
      
        res.status(200).json(projects[0]);
  
    } else if (projectId != "" && projectId != undefined && accountId != "" && accountId != undefined && accountId == "NaN") {
      console.log("222222")
      const projects = await prisma.project.findMany({
        where: {
          id: {
            equals: parseInt(projectId.toString())            
          }
      },
        include: {
          address: true,
          account: true      ,
          vendor: true    
        }
      })
      console.log("2222222  projects[0]::"+JSON.stringify(projects[0]))
        res.status(200).json(projects[0]);
  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
