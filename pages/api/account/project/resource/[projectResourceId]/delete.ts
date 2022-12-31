// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { EMPTY_STRING } from "../../../../../../constants/accountConstants";
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // const projectResource = req.body;
    const projectResourceId = req.query?.projectResourceId;
    
    console.log(" INSIDE DELETE OF projectResource::"+JSON.stringify(projectResourceId));

    if(projectResourceId != undefined) {
        const deleteProjectResource = await prisma.projectResource.delete({
            where: {
              id: parseInt(projectResourceId.toString())
            }
          });
          res.status(200).json(deleteProjectResource);
    }else {
        res.status(400).json({ error: true, message: 'Something went wrong while deleting project resource. Details:'})
    }

    

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: true, message: 'Something went wrong while deleting project resource. Details:'+error })
  }
}
