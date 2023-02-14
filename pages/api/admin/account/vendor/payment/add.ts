// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, FeatureStatus, PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { PaymentConstants } from "../../../../../../constants";
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

      const vendorDetails = await prisma.vendor.findUnique({
        where: {
          id: parseInt(vendorId.toString())
        },
        include: {
          address: true          
        }
      })      
  
      console.log("accountPaymentProcFeature:::"+JSON.stringify(accountPaymentProcFeature))
      if(accountPaymentProcFeature && accountPaymentProcFeature.configuration && accountPaymentProcFeature.configuration['processor']) { 
        if(accountPaymentProcFeature.configuration['processor'] === PaymentConstants.SUPPORTED_PAYMENT_PROCESSORS.Dwolla) {
          processDwollaPaymentProcessor(paymentAccountData, vendorDetails)
        }
      } else {
        res.status(400).json({ message: 'Processor Not enabled for this account, please contact administrator.' })
      }

    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}


const processDwollaPaymentProcessor = async(paymentAccountData, vendorDetails) => {

  //Create the customer first and the create the funding source

}