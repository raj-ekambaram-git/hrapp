// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PaymentMethodStatus, PaymentMethodType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
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
    const {publicToken} = req.body;

    console.log("accountId:::"+accountId+"-----userId::"+userId+"**publicToken::"+publicToken);
    
    if(userId && accountId && publicToken) {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: publicToken,
      });

      console.log("tokenResponse:::"+JSON.stringify(tokenResponse.data))
      const accountPaymentMethodInfo = await prisma.paymentMethod.create({
        data: {
          type: PaymentMethodType.Account,
          itemId: tokenResponse.data.item_id,
          token: tokenResponse.data.access_token, //TODO, encryp the token and persist
          status: PaymentMethodStatus.Active,
          accountId: parseInt(accountId.toString()),
          updatedBy: parseInt(userId.toString())
        }
      })

      res.status(200).json(tokenResponse.data);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }



  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
