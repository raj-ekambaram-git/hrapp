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

    console.log("accountId:::"+accountId+"-----userId::"+userId);
    const accountPaymentMethodInfo = await prisma.paymentMethod.findMany({
      where: {
        accountId: parseInt(accountId.toString()),
        status: PaymentMethodStatus.Active,
        type: PaymentMethodType.Account
      },
      select: {
        id: true,
        status: true,
        token: true
      }
    })

    console.log("accountPaymentMethodInfo::"+JSON.stringify(accountPaymentMethodInfo))
    if(accountPaymentMethodInfo) {
      const linkedAccountData =  await Promise.all(accountPaymentMethodInfo.map(async (linkedAccount) => {
        const itemResponse = await client.itemGet({
          access_token: linkedAccount.token,
        });
    
        // Also pull information about the institution
        const configs = {
          institution_id: itemResponse.data.item.institution_id,
          country_codes: (process.env.PLAID_COUNTRY_CODES || 'US').split(','),
        };
        const instResponse = await client.institutionsGetById(configs);
  
        
        delete accountPaymentMethodInfo["token"]
        const instData = {
          accountPaymentMethodInfo: linkedAccount,
          // item: itemResponse.data.item,
          institutionName: instResponse.data.institution.name,
        }
        console.log("instData::::"+JSON.stringify(instData))

        return instData;
      }))

    res.status(200).json(linkedAccountData);

    }else {
      res.status(200).json(null);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
