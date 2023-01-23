// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {projectResourceData} = req.body;
    const {projetUpdateData} = req.body;
    
    console.log("Inside the update project resource:::"+JSON.stringify(projectResourceData));

    const savedProjectResource = await prisma.projectResource.update({
      where: {
        id: projectResourceData.id,
      },
      data: projectResourceData,
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

    //Project Resource created now update the project
    if(savedProjectResource != undefined && projetUpdateData) {
      console.log("INSIDE UPDATING THE REMAINIGN BUDGET FOR PROJECT")
      const savedProject = await prisma.project.update({
        where: {
          id: projetUpdateData.projectId,
        },
        data: {
          remainingBudgetToAllocate: projetUpdateData.remainingBudgetToAllocate
        }
      });
      res.status(200).json(savedProjectResource);

    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
