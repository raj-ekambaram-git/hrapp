// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PaymentMethodStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
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
          status: PaymentMethodStatus.Active
        },
        include: {          
          account: {            
            include: {
              accoutFeatures: {
                where: {
                  feature: {
                    name: "PaymentProcessor"
                  }
                },
                select: {
                  configuration: true
                }
              }
            }
          }
        }
      })
  
      console.log("accountPaymentMethodInfo:::"+JSON.stringify(accountPaymentMethodInfo))
      if(accountPaymentMethodInfo) { 

      }

    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }
  

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
