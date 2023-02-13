// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../../lib/prisma";



export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
    const {userId} = req.body;
    const {accountId} = req.body;

    console.log("accountId:::"+accountId+"-----userId::"+userId);
    const accountPaymentMethodInfo = await prisma.paymentMethod.findFirst({
      where: {
        accountId: parseInt(accountId.toString())
      },

    })

    console.log("accountPaymentMethodInfo:::"+JSON.stringify(accountPaymentMethodInfo))
      res.status(200).json(accountPaymentMethodInfo);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
