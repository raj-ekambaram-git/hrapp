// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
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

    console.log("accountId:::"+accountId+"-----userId::"+userId);
    if(userId && accountId) {
      const accountPaymentMethodInfo = await prisma.paymentMethod.findFirst({
        where: {
          accountId: parseInt(accountId.toString())
        },
  
      })
  
      console.log("accountPaymentMethodInfo:::"+JSON.stringify(accountPaymentMethodInfo))

      const balanceResponse = await client.accountsBalanceGet({
        access_token: accountPaymentMethodInfo.token,
      });

      console.log("balanceResponse::::"+JSON.stringify(balanceResponse.data))
        res.status(200).json(balanceResponse.data);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })  
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
