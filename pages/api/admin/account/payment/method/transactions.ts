// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { AccountFeatureStatus, ExpenseStatus, FeatureStatus, InvoiceStatus, PaymentMethodStatus, UserStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import { ConfigConstants } from "../../../../../../constants";
import { util } from "../../../../../../helpers";
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
    const {transactionRequest} = req.body;

    console.log("accountId:::"+accountId+"-----userId::"+userId+"*****transactionRequest::::"+JSON.stringify(transactionRequest));
    if(userId && accountId && transactionRequest) {
      //First Check if the user belongs to this account

      const userData = await prisma.user.findFirst({
        where: {
          id: parseInt(userId.toString()),
          accountId: parseInt(accountId.toString()),
          status: {
            in: [UserStatus.Active, UserStatus.Approved]
          }
        },
        include: {
          account: {
            include: {
              accoutFeatures: {
                where: {
                  feature: {
                    name: ConfigConstants.FEATURES.PAYMENT,
                    status: FeatureStatus.Active
                  },
                  status: AccountFeatureStatus.Active
                }
              }
            }
          }
        }
      });

      console.log("userData::::"+JSON.stringify(userData))
      if(userData && userData.account.accoutFeatures && userData.account.accoutFeatures.length>0 && transactionRequest.paymentMethodId) {
        //Get the PaymentMethod for the given ID
        const paymentMethod = await prisma.paymentMethod.findUnique({
          where: {
            id: parseInt(transactionRequest.paymentMethodId.toString()),
          },
        });

        console.log("paymentMethod::::"+JSON.stringify(paymentMethod))

        if(paymentMethod && paymentMethod.status === PaymentMethodStatus.Active && paymentMethod.accountId === accountId) {
          //Now Call the Plaid
          let pastDays = transactionRequest.pastDays*1;
          const transactions = await client.transactionsGet({
            access_token: paymentMethod.token,
            end_date: util.getPaymentFormattedDate(new Date()),
            start_date: util.getPastDateFromGivenDate(new Date(),pastDays),
            options: {
              offset: transactionRequest.offSetData,
              count: ConfigConstants.MAX_PAYMENT_TRANSACTIONS.count
            },
          });

          console.log("transactions.data::::"+JSON.stringify(transactions.data))

          if(transactions.data && transactions.data?.transactions && transactions.data?.total_transactions > 0) {
            const transactionIds = transactions.data?.transactions?.map((transaction) => {return transaction.transaction_id})
            console.log("transactionIds::::"+JSON.stringify(transactionIds))
            
            //Check if any of these transactions are already marked under invoice
            const alreadyMarkedInvoiceTransactions = await prisma.invoiceTransaction.findMany({
              where: {
                transactionId: {
                  in: transactionIds
                },
                invoice: {
                  accountId: parseInt(accountId.toString()),
                  status: {
                    in: [InvoiceStatus.Submitted, InvoiceStatus.PartiallyPaid]
                  }
                },
              },
            });
            console.log("alreadyMarkedInvoiceTransactions:::"+JSON.stringify(alreadyMarkedInvoiceTransactions))

            //Check if any of these transactions are already marked under expense
            const alreadyMarkedExpenseTransactions = await prisma.expenseTransaction.findMany({
              where: {
                transactionId: {
                  in: transactionIds
                },
                expense: {
                  project: {
                    accountId: parseInt(accountId.toString())
                  },
                  status: {
                    in: [ExpenseStatus.Approved, ExpenseStatus.PartiallyPaid]
                  }
                },
              },
            });
            console.log("alreadyMarkedExpenseTransactions:::"+JSON.stringify(alreadyMarkedExpenseTransactions))

            res.status(200).json({transactionIds})
          } else {
            res.status(200).json({})
          }
          
          

        } else {
          res.status(400).json({ message: 'Payment method requested is not present.' })
        }


      } else {
        res.status(400).json({ message: 'User dont have access.' })
      }

    }
    // const accountPaymentMethodInfo = await prisma.paymentMethod.findFirst({
    //   where: {
    //     accountId: parseInt(accountId.toString()),
    //     status: PaymentMethodStatus.Active
    //   },
    // })

    // if(accountPaymentMethodInfo) {
    //   const itemResponse = await client.itemGet({
    //     access_token: accountPaymentMethodInfo.token,
    //   });
  
    //   // Also pull information about the institution
    //   const configs = {
    //     institution_id: itemResponse.data.item.institution_id,
    //     country_codes: (process.env.PLAID_COUNTRY_CODES || 'US').split(','),
    //   };
    //   const instResponse = await client.institutionsGetById(configs);

    //   const linkedAccountData = {
    //     accountPaymentMethodInfo: accountPaymentMethodInfo,
    //     // item: itemResponse.data.item,
    //     institutionName: instResponse.data.institution.name,
    //   }

      

    // res.status(200).json(linkedAccountData);

    // }else {
    //   res.status(200).json(null);
    // }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}


