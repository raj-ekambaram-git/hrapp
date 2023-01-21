// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {appConfigAdminRequest} = req.body;


    console.log("appConfigAdminRequest:::"+JSON.stringify(appConfigAdminRequest));
    
    const savedAppConfig = await prisma.appConfig.update({
      where: {
        id: appConfigAdminRequest.id,
      },
      data: {
        ...appConfigAdminRequest,
      }
    });

    res.status(200).json(savedAppConfig);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
