// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
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
      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: userId.toString(),
        },
        client_name: process.env.PLAID_CLIENT_NAME,
        products: (process.env.PLAID_PRODUCTS || Products.Transactions).split(','),
        country_codes: (process.env.PLAID_COUNTRY_CODES || 'US').split(','),
        language: 'en',
      };

      if (process.env.PLAID_REDIRECT_URI !== '') {
        configs["redirect_uri"] = process.env.PLAID_REDIRECT_URI;
      }

      console.log("CONFIGISGSS:::"+JSON.stringify(configs))
      
      const createTokenResponse = await client.linkTokenCreate(configs);
      console.log("1112121")
      console.log("createTokenResponse:::"+JSON.stringify(createTokenResponse.data))
      res.status(200).json(createTokenResponse.data);
  
    } else {
      res.status(400).json({ message: 'Something went wrong while updating' })
    }



  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
