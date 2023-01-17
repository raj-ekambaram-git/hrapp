import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const expenseService = {

    getExpenseDetails,
    createExpense,
    updateExpense
};

function updateExpense(expense, expenseEntries) {

    return fetchWrapper.put(`${baseUrl}/expense/`+expense.id, {
          expense,
          expenseEntries
        }
    )
    .then(expense => {
      
      return expense;
    })
    .catch(err => {
      console.log("Error Updating Expense::"+err)
      return {errorMessage: err, error: true};
  });
  }

function createExpense(expenseRequest) {
    console.log("Before calling the create expense....."+JSON.stringify(expenseRequest))
  
    return fetchWrapper.post(`${baseUrl}/expense/create`, {expenseRequest}
    )
    .then(async expense => {
        return expense;
    })        
    .catch(err => {
      console.log("Error Creating Expense"+err)
      return {errorMessage: err, error: true};
    });
}

function getExpenseDetails(expenseId, accountId) {
    return fetchWrapper.get(`${baseUrl}/expense/${expenseId}/detail?accountId=`+accountId, {})
        .then(expense => {
            return expense;
        })  
        .catch(err => {
          console.log("Error Getting getExpenseDetails")
          return {errorMessage: err, error: true};
      });
}