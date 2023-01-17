import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const expenseService = {

    getExpenseDetails,
    createExpense,
    updateExpense,
    handleExpenseApproval,
    addAttachmentToExpenseEntry
};

async function addAttachmentToExpenseEntry(expenseEntryId, attachments) {

  return fetchWrapper.put(`${baseUrl}/expense/entry/`+expenseEntryId, {
          id: parseInt(expenseEntryId),
          attachments: attachments
      }
    )
    .then(expenseEntry => {
      return expenseEntry;
    })
    .catch(err => {
    console.log("Error Updating Expense::"+err)
    return {errorMessage: err, error: true};
    });
}

async function handleExpenseApproval(expenseId, status, expenseNote, approvedBy) {

  return fetchWrapper.put(`${baseUrl}/expense/`+expenseId+'/status', {
        expense: {
          id: parseInt(expenseId),
          status: status,
          approvedDate: new Date(),  
          approvedById: approvedBy
        },
        expenseNote: expenseNote,
        notesCreatedBy: approvedBy
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
