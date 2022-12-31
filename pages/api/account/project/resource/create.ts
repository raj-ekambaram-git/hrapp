// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../constants/accountConstants";
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projectResource = req.body;
    
    // const user: Prisma.UserCreateInput = JSON.parse(req.body);
    const savedProjectResource = await prisma.projectResource.create({
      data: projectResource.projectResourceData
    });

    //Project Resource created now update the project
    if(savedProjectResource != undefined) {
      const savedProject = await prisma.project.update({
        where: {
          id: projectResource.projetUpdateData.projectId,
        },
        data: {
          remainingBudgetToAllocate: projectResource.projetUpdateData.remainingBudgetToAllocate
        }
      });
      res.status(200).json(savedProjectResource);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: true, message: 'Something went wrong. Details:'+error })
  }
}
