// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, FeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants, EMPTY_STRING } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {verificationRequest} = req.body;
    const {accountId} = req.body;

    console.log("accountId:::"+accountId+"-----verificationRequest::"+JSON.stringify(verificationRequest));
    if(accountId && verificationRequest) {

      const account = await prisma.account.findUnique({
        where: {
          id: parseInt(accountId.toString()),          
        },
        include: {
          address: true,
          accoutFeatures: {
            where: {
              feature: {
                name: ConfigConstants.FEATURES.PAYMENT_PROCESSOR
              },
              status: AccountFeatureStatus.Active
            },
            select: {
              id: true,
              configuration: true
            }
          },
        }
      })

      if(account && account.accoutFeatures[0]?.configuration) {

        const processor = account.accoutFeatures[0]?.configuration["processor"]
        let processorResponse = {};
        let processTokenResponse;
        if(processor === ConfigConstants.PAYMENT_PROCESSORS.Dwolla) {
          //Generate processorToken for DWOLLO integration
          processorResponse = await processDwolla(account, verificationRequest)
        };

        if((processor && processorResponse && processorResponse['success'])) {

          const configData = account.accoutFeatures[0]?.configuration;
          configData["processorAccountId"] = processorResponse["processCustomerId"]
          configData["accountVerificationConsent"] = true
          
          //Now update the customer ID into account features record
          const accountPaymentMethodInfo = await prisma.accoutFeatures.update({
            where: {
              id: account.accoutFeatures[0]?.id
            },
            data: {
              configuration: configData
            }
          });
          res.status(200).json({verified: true, accountPaymentMethodInfo: accountPaymentMethodInfo});
        } else {
          res.status(400).json({ message: 'Something went wrong while updating' })
        }

        
      } else {
        res.status(400).json({ message: 'Something went wrong while verifying' })
      }
    }else {
      res.status(400).json({ message: 'Something went wrong while verifying' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while verifying' })
  }
}



const processDwolla = async(account, verificationRequest) => {
  const dClient = require("dwolla-v2").Client;

  const dwolla = new dClient({
    environment: "sandbox", // Defaults to "production"
    key: util.decryptConfigHash(account.accoutFeatures[0]?.configuration["processorKey"], account.accoutFeatures[0]?.configuration["salt"]),
    secret: util.decryptConfigHash(account.accoutFeatures[0]?.configuration["processorSecret"], account.accoutFeatures[0]?.configuration["salt"]),
  });

  
  const dResponse = await dwolla
    .post("customers", verificationRequest); // => 'https://api-sandbox.dwolla.com/customers/247B1BD8-F5A0-4B71-A898-F62F67B8AE1C'

    const customerDetail = await dwolla.get(dResponse.headers.get("Location"));
  
  return { success: true, processCustomerId: customerDetail?.body?.id}
} 