// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants, PaymentConstants } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";
const { Configuration, PlaidApi, Products, PlaidEnvironments} = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_KEY,
      'Plaid-Version': process.env.PLAID_VERSION,
    },
  },
});
const client = new PlaidApi(configuration);




export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {userId} = req.body;
    const {accountId} = req.body;
    const {status} = req.body;
    const {paymentMethodId} = req.body;
    

    if(userId && accountId && status) {
      const accountPaymentMethodInfo = await prisma.paymentMethod.update({
        where: {
          id: paymentMethodId
        },
        data: {
          status: status
        },
      })

      if(status === PaymentMethodStatus.Inactive) {
        const paymentProcessorAccountFeature = await prisma.accoutFeatures.findFirst({
          where: {
            accountId: parseInt(accountId.toString()),
            status: AccountFeatureStatus.Active,
            feature: {
              name: {
                equals: ConfigConstants.FEATURES.PAYMENT_PROCESSOR
              }
            }
          },
        })
    
        if(paymentProcessorAccountFeature && paymentProcessorAccountFeature.configuration 
            && paymentProcessorAccountFeature.configuration['processor'] === PaymentConstants.SUPPORTED_PAYMENT_PROCESSORS.Dwolla) {
  
              const processorResponse = await processDwolla(paymentProcessorAccountFeature.configuration, accountPaymentMethodInfo)
              if(processorResponse.success) {
                console.log("INSIDE SUCCESS")
                res.status(200).json(null)
              } else {
                res.status(400).json({ message: 'NO active payment methods available for this vendor.' })
              }
  
        }
      } else {
        console.log("accountPaymentMethodInfo:::"+JSON.stringify(accountPaymentMethodInfo))
        res.status(200).json(null);  
      }



    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}



const processDwolla = async(configuration, accountPaymentMethodInfo) => {

  const dClient = require("dwolla-v2").Client;

  const dwolla = new dClient({
    environment: "sandbox", // Defaults to "production"
    key: util.decryptConfigHash(configuration["processorKey"], configuration["salt"]),
    secret: util.decryptConfigHash(configuration["processorSecret"], configuration["salt"]),
  });

  const udeActivatedCustomer = await dwolla.post('customers/'+accountPaymentMethodInfo.processCustomerId, {
    "status": "deactivated"
  });
  

  const paymentData = {
    success: true, 
  }

  return paymentData
} 