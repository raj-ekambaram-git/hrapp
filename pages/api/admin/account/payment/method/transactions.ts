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

      if(userData && userData.account.accoutFeatures && userData.account.accoutFeatures.length>0 && transactionRequest.paymentMethodId) {
        //Get the PaymentMethod for the given ID
        const paymentMethod = await prisma.paymentMethod.findUnique({
          where: {
            id: parseInt(transactionRequest.paymentMethodId.toString()),
          },
        });


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

          if(transactions.data && transactions.data?.transactions && transactions.data?.total_transactions > 0) {
            const transactionIds = transactions.data?.transactions?.map((transaction) => {              
              return {
                transactionId: {                  
                  contains: transaction.transaction_id
                },
              }
            })
            
            //Check if any of these transactions are already marked under invoice
            const alreadyMarkedInvoiceTransactions = await prisma.invoiceTransaction.findMany({
              where: {
                OR: transactionIds,
                invoice: {
                  accountId: parseInt(accountId.toString()),
                  status: {
                    in: [InvoiceStatus.Submitted, InvoiceStatus.PartiallyPaid, InvoiceStatus.Paid]
                  }
                },
              },
            });
            const markedInvoiceTransactionIds = alreadyMarkedInvoiceTransactions.map((transaction) => {return transaction.transactionId});

            //Check if any of these transactions are already marked under expense
            const alreadyMarkedExpenseTransactions = await prisma.expenseTransaction.findMany({
              where: {
                OR: transactionIds,
                expense: {
                  project: {
                    accountId: parseInt(accountId.toString())
                  },
                  status: {
                    in: [ExpenseStatus.Approved, ExpenseStatus.PartiallyPaid, ExpenseStatus.Paid]
                  }
                },
              },
            });

            const markedExpenseTransactionIds = [];
            alreadyMarkedExpenseTransactions.map((transaction) => {
              transaction.transactionId.split(",").map((tranId) => {
                markedExpenseTransactionIds.push(tranId)
              })
            });

            //Now loop through all the transactions and mark the status for the response
            const transactionResponse = transactions.data?.transactions?.map((transaction) => {
              const transactionObj = {};
              const accountData = transactions.data?.accounts?.filter(account => (account.account_id === transaction.account_id))
              
              if(accountData && accountData.length>0) {
                transactionObj["account_name"] = accountData[0].name
                transactionObj["account_mask"] = accountData[0].mask
                transactionObj["account_subtype"] = accountData[0].subtype  
              }

              transactionObj["account_id"] = transaction.account_id
              transactionObj["transaction_id"] = transaction.transaction_id
              transactionObj["transaction_amount"] = transaction.amount
              transactionObj["transaction_date"] = transaction.date
              transactionObj["transaction_datetime"] = transaction.datetime
              transactionObj["transaction_category"] = transaction.category
              transactionObj["transaction_pending"] = transaction.pending
              transactionObj["transaction_marked"] = false
              if(markedExpenseTransactionIds.includes(transaction.transaction_id)) {
                transactionObj["transaction_marked"] = true
                transactionObj["transaction_type"] = "Expense"
              }
              if(markedInvoiceTransactionIds.includes(transaction.transaction_id)) {
                transactionObj["transaction_marked"] = true
                transactionObj["transaction_type"] = "Invoice"
              }           

              return transactionObj
            });

            res.status(200).json(transactionResponse)
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


