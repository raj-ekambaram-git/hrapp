// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PaymentMethodStatus } from "@prisma/client";
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

    //First Get the intet ID using the account Id and other details
    const createIntentRequet =  {
      account_id: '4KMjalkVRDCvQVJANeKgFQDz7rXDGqc3pALWD',
      funding_account_id: "lxvGWVQp8VhDr9kagKJWigPqByAwMvUEvqWqB",
      mode: 'DISBURSEMENT',
      amount: '55.34',
      description: 'Foobar',
      ach_class: 'ppd',
      user: {
        legal_name: 'BO Needs',
      }
    }

    const intentResponse = await client.transferIntentCreate(createIntentRequet);

    console.log("intentResponse:::"+JSON.stringify(intentResponse.data))

    const transferLinkTokenRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: userId.toString(),
      },
      client_name: process.env.PLAID_CLIENT_NAME,
      products: ['transfer'],
      country_codes: (process.env.PLAID_COUNTRY_CODES || 'US').split(','),
      language: 'en',
      access_token: "access-sandbox-2253181a-0037-4727-8d99-a3ab5c85d254",
      transfer: {
        intent_id: intentResponse.data.transfer_intent.id,
      },
      // account_filters: {
      //   depository: {
      //     account_subtypes: [
      //       'DepositoryAccountSubtype.Checking', 'DepositoryAccountSubtype.Savings',
      //     ],
      //   },
      // },
      link_customization_name: 'dsq_boneeds',
    };
    

    if (process.env.PLAID_REDIRECT_URI !== '') {
      transferLinkTokenRequest["redirect_uri"] = process.env.PLAID_REDIRECT_URI;
    }

    const response = await client.linkTokenCreate(transferLinkTokenRequest);
    console.log("transferLinkTokenRequest:::response:::"+JSON.stringify(response.data))
    // const linkToken = response.data.link_token;
    res.status(200).json(response.data);
    //Get the intent ID and pass that to generate link token

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
