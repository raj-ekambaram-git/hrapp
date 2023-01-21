// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const appConfigId = req.query?.appConfigId;
    const accountId = req.query?.accountId;
    
    console.log("appConfigId::"+appConfigId)
    if(appConfigId != "" && appConfigId != undefined && accountId != "" && accountId != undefined && accountId != "NaN") {
      const appConfig = await prisma.appConfig.findMany({
        where: {
          id: {
            equals: parseInt(appConfigId.toString())            
          },
      },
      })
        console.log("appConfig:::"+JSON.stringify(appConfig))
        res.status(200).json(appConfig[0]);
  
    }else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
