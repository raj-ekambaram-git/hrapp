// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { FeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants, EMPTY_STRING } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";

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
            name: ConfigConstants.FEATURES.PAYMENT_PROCESSOR,
            status: FeatureStatus.Active
          }
        },
      })
      if(accountFeatureConfigData) {
        if(accountFeatureConfigData.configuration && accountFeatureConfigData.configuration["processor"]) {
          res.status(200).json({
            configured: true, 
            accountVerified: accountFeatureConfigData.configuration["processorAccountId"]?accountFeatureConfigData.configuration["processorAccountId"]:EMPTY_STRING,
            accountFeatureId: accountFeatureConfigData.id, 
            configuration: {
              processor: accountFeatureConfigData.configuration["processor"]?accountFeatureConfigData.configuration["processor"]:EMPTY_STRING,
              processorKey: accountFeatureConfigData.configuration["processorKey"]?util.decryptConfigHash(accountFeatureConfigData.configuration["processorKey"], accountFeatureConfigData.configuration["salt"]):EMPTY_STRING,
              processorConsent: accountFeatureConfigData.configuration["processorConsent"]?accountFeatureConfigData.configuration["processorConsent"]:false,
              processorAccountId: accountFeatureConfigData.configuration["processorAccountId"]?accountFeatureConfigData.configuration["processorAccountId"]:EMPTY_STRING,
              accountVerificationConsent: accountFeatureConfigData.configuration["accountVerificationConsent"]?accountFeatureConfigData.configuration["accountVerificationConsent"]:EMPTY_STRING,
            }
          });
        } else {
          res.status(200).json({configured: false, accountFeatureId: accountFeatureConfigData.id });
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
