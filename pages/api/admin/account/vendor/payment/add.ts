// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, FeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {vendorId} = req.body;
    const {accountId} = req.body;
    const {paymentAccountData} = req.body;

    console.log("accountId:::"+accountId+"-----vendorId::"+vendorId)+"*****paymentAccountData::"+JSON.stringify(paymentAccountData);

    if(vendorId && accountId) {
      const accountPaymentProcFeature = await prisma.accoutFeatures.findFirst({
        where: {
          accountId: parseInt(accountId.toString()),
          status: AccountFeatureStatus.Active,
          feature: {
            status: FeatureStatus.Active,
            name: "PaymentProcessor"
          }
        },
      })
  
      console.log("accountPaymentProcFeature:::"+JSON.stringify(accountPaymentProcFeature))
      if(accountPaymentProcFeature) { 

      }

    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
