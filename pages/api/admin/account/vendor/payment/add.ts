// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, FeatureStatus, PaymentMethodStatus, PaymentMethodType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants, PaymentConstants } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {userId} = req.body;
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
            name: ConfigConstants.FEATURES.PAYMENT_PROCESSOR
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
          console.log("2222222")
          const processorResponse = await processDwollaPaymentProcessor(paymentAccountData, vendorDetails, accountPaymentProcFeature.configuration)
          console.log("processorResponse::::"+JSON.stringify(processorResponse))
          if((processorResponse && processorResponse['success'])) {
            const accountPaymentMethodInfo = await prisma.paymentMethod.create({
              data: {
                type: PaymentMethodType.Vendor,
                vendorId: parseInt(vendorId.toString()),
                status: PaymentMethodStatus.Active,
                processCustomerId: processorResponse["processCustomerId"],
                processorPaymentId: processorResponse["processorPaymentId"],
                accountId: parseInt(accountId.toString()),
                updatedBy: parseInt(userId.toString()),
              }
            })
      
            res.status(200).json(accountPaymentMethodInfo);
          } else {
            res.status(400).json({ message: 'Something went wrong while updating' })
          }
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


const processDwollaPaymentProcessor = async(paymentAccountData, vendorDetails, configuration) => {

  //Create the customer first and the create the funding source

  const dClient = require("dwolla-v2").Client;

  console.log("KEYYY :::"+util.decryptConfigHash(configuration["processorKey"], configuration["salt"]))
  const dwolla = new dClient({
    environment: "sandbox", // Defaults to "production"
    key: util.decryptConfigHash(configuration["processorKey"], configuration["salt"]),
    secret: util.decryptConfigHash(configuration["processorSecret"], configuration["salt"]),
  });

  var requestBody = {
    firstName: "Vendor First Name",
    lastName: "Vendor Last Name",
    email: vendorDetails.email,
    ipAddress: "99.99.99.99",
    businessName: vendorDetails.name,
    ein: vendorDetails.ein
  };
  
  const dResponse = await dwolla
    .post("customers", requestBody); // => 'https://api-sandbox.dwolla.com/customers/247B1BD8-F5A0-4B71-A898-F62F67B8AE1C'

    const customerDetail = await dwolla.get(dResponse.headers.get("Location"));

    const createdFundingResponse =  await dwolla.post(`customers/${customerDetail?.body?.id}/funding-sources`, {
      routingNumber: paymentAccountData.routingNumber,
      accountNumber: paymentAccountData.accountNumber,
      type: paymentAccountData.bankType,
      name: paymentAccountData.bankName,
    });

  const customerFundingResource = await dwolla.get(createdFundingResponse?.headers?.get("Location"));
  
  const returnVal = { success: true, processCustomerId: customerDetail?.body?.id, processorPaymentId: customerFundingResource?.body?.id,}

  console.log("RETURN::::"+JSON.stringify(returnVal))
  return returnVal;

}