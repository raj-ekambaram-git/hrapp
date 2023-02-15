// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants, PaymentConstants } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {vendorId} = req.body;
    const {accountId} = req.body;

    console.log("accountId:::"+accountId+"-----vendorId::"+vendorId);

    if(vendorId && accountId) {
      const accountPaymentMethodInfo = await prisma.paymentMethod.findFirst({
        where: {
          accountId: parseInt(accountId.toString()),
          vendorId: parseInt(vendorId.toString()),
          status: PaymentMethodStatus.Active,
          account: {
            accoutFeatures: {
              every: {
                status: AccountFeatureStatus.Active
              }
            }
          }
          
        },
        include: {          
          account: {            
            include: {
              accoutFeatures: {
                where: {
                  feature: {
                    name: ConfigConstants.FEATURES.PAYMENT_PROCESSOR
                  }
                },
                select: {
                  feature: {
                    select: {
                      name: true
                    }
                  },                  
                  configuration: true
                }
              }
            }
          }
        }
      })
  
      if(accountPaymentMethodInfo && accountPaymentMethodInfo.account && accountPaymentMethodInfo.account?.accoutFeatures
          && accountPaymentMethodInfo.account?.accoutFeatures.length>0 
          && accountPaymentMethodInfo.account?.accoutFeatures[0].feature?.name === ConfigConstants.FEATURES.PAYMENT_PROCESSOR) { 
        
            if(accountPaymentMethodInfo.account?.accoutFeatures[0].configuration 
              && accountPaymentMethodInfo.account?.accoutFeatures[0].configuration['processor'] === PaymentConstants.SUPPORTED_PAYMENT_PROCESSORS.Dwolla ) {
                const processorResponse = await processDwolla(accountPaymentMethodInfo)
                if(processorResponse.success) {
                  res.status(200).json(processorResponse)
                } else {
                  res.status(400).json({ message: 'NO active payment methods available for this vendor.' })
                }
              }
            

      } else {
        res.status(200).json(null)
      }

    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}



const processDwolla = async(accountPaymentMethodInfo) => {
  const dClient = require("dwolla-v2").Client;

  const dwolla = new dClient({
    environment: "sandbox", // Defaults to "production"
    key: util.decryptConfigHash(accountPaymentMethodInfo.account.accoutFeatures[0]?.configuration["processorKey"], accountPaymentMethodInfo.account.accoutFeatures[0]?.configuration["salt"]),
    secret: util.decryptConfigHash(accountPaymentMethodInfo.account.accoutFeatures[0]?.configuration["processorSecret"], accountPaymentMethodInfo.account.accoutFeatures[0]?.configuration["salt"]),
  });

  const fundingSource = await dwolla.get('funding-sources/'+accountPaymentMethodInfo.processorPaymentId, {});
  
  const paymentData = {
    success: true, 
    bankName: fundingSource.body?.bankName, 
    bankType: fundingSource.body?.bankAccountType, 
    name: fundingSource.body?.name,
    status: fundingSource.body?.status,
  }

  return paymentData
} 