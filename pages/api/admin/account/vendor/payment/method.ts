// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants } from "../../../../../../constants";
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
  
      console.log("METHOD::::::accountPaymentMethodInfo:::"+JSON.stringify(accountPaymentMethodInfo))
      if(accountPaymentMethodInfo && accountPaymentMethodInfo.account && accountPaymentMethodInfo.account?.accoutFeatures
          && accountPaymentMethodInfo.account?.accoutFeatures.length>0 
          && accountPaymentMethodInfo.account?.accoutFeatures[0].feature?.name === ConfigConstants.FEATURES.PAYMENT_PROCESSOR) { 
        
            console.log("INSIDE THIS AND PROCESSOR ENABLED")

      } else {
        res.status(400).json({ message: 'NO active payment methods available for this vendor.' })
      }

    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
