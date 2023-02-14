// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { FeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {userId} = req.body;
    const {accountId} = req.body;

    console.log("accountId:::"+accountId+"-----userId::"+userId);
    if(accountId && userId) {
      const accountFeatureConfigData = await prisma.accoutFeatures.findFirst({
        where: {
          accountId: parseInt(accountId.toString()),
          feature: {
            name: "Payment",
            status: FeatureStatus.Active
          }
        },
      })
      if(accountFeatureConfigData) {
        console.log("accountFeatureConfigData::"+JSON.stringify(accountFeatureConfigData))
        if(accountFeatureConfigData.configuration) {
          console.log("accountFeatureConfigData.configuration::"+JSON.stringify(accountFeatureConfigData.configuration))
          res.status(200).json({configured: true, accountFeatureId: accountFeatureConfigData.id});
        } else {
          res.status(200).json({configured: false, accountFeatureId: accountFeatureConfigData.id});
        }
      }
    }else {
      res.status(200).json(null);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
