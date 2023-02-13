// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PaymentMethodStatus, PaymentMethodType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../../lib/prisma";
const { Configuration, PlaidApi, Products, PlaidEnvironments, ProcessorTokenCreateRequestProcessorEnum,ProcessorTokenCreateRequest} = require('plaid');

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

const dClient = require("dwolla-v2").Client;

const dwolla = new dClient({
  environment: "sandbox", // Defaults to "production"
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
});


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {userId} = req.body;
    const {accountId} = req.body;
    const {publicToken} = req.body;
    const {plaidMetaData} = req.body;
    

    console.log("accountId:::"+accountId+"-----userId::"+userId+"**publicToken::"+publicToken);
    
    if(userId && accountId && publicToken) {

      //Exchange Plaid Public Token to access_token
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: publicToken,
      });

      //Generate processorToken for DWOLLO integration
      const processTokenResponse = await client.processorTokenCreate({
        access_token: tokenResponse.data.access_token,
        account_id: plaidMetaData.accounts[0].id,
        processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla
      });

      console.log("processTokenResponse::::"+JSON.stringify(processTokenResponse.data))

      console.log("tokenResponse:::"+JSON.stringify(tokenResponse.data))

      //Now get Account Details to create the verified customer
      const account = await prisma.account.findUnique({
        where: {
          id: parseInt(accountId.toString()),          
        },
        include: {
          address: true,
          user: {
            where: {
              accountOwner: true
            },
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      console.log("ACCOUNT DETAILS:::"+JSON.stringify(account))
      /**
       * Now Dwolla Integration
       */
      var requestBody = {
        firstName: account.user[0].firstName,
        lastName: account.user[0].firstName,
        email: account.email,
        ipAddress: "99.99.99.99",
        businessName: account.name
      };
      
      const dResponse = await dwolla
        .post("customers", requestBody); // => 'https://api-sandbox.dwolla.com/customers/247B1BD8-F5A0-4B71-A898-F62F67B8AE1C'

        console.log("Created Resource: ", dResponse.headers.get("Location"));

        const customerDetail = await dwolla.get(dResponse.headers.get("Location"));

        console.log("customerDetail::::"+JSON.stringify(customerDetail))

        const createdFundingResponse =  await dwolla.post(`customers/${customerDetail?.body?.id}/funding-sources`, {
          name:plaidMetaData.accounts[0].name,
          plaidToken: processTokenResponse.data.processor_token
      });

      console.log("createdFundingResponse::::"+createdFundingResponse?.headers?.get("Location"))

      const customerFundingResource = await dwolla.get(createdFundingResponse?.headers?.get("Location"));
      console.log("customerFundingResource:::"+JSON.stringify(customerFundingResource))
      
      const accountPaymentMethodInfo = await prisma.paymentMethod.create({
        data: {
          type: PaymentMethodType.Account,
          itemId: tokenResponse.data.item_id,
          token: tokenResponse.data.access_token, //TODO, encryp the token and persist
          status: PaymentMethodStatus.Active,
          processorToken: processTokenResponse.data.processor_token,
          processCustomerId: customerDetail?.body?.id,
          processorPaymentId: customerFundingResource?.body?.id,
          accountId: parseInt(accountId.toString()),
          updatedBy: parseInt(userId.toString()),
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
