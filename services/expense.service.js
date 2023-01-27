import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { CommonConstants, EmailConstants, EMPTY_STRING, ExpenseConstants } from '../constants';
import { util } from '../helpers/util';
import { projectService } from './project.service';
import { ExpenseStatus } from '@prisma/client';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const expenseService = {

    getExpenseDetails,
    createExpense,
    updateExpense,
    handleExpenseApproval,
    addAttachmentToExpenseEntry,
    getExpenseTransactions,
    createExpenseTransaction,
    updateExpenseStatus,
    markExpenseDelete,
    getNewExpenseEmailRequest
};



function getNewExpenseEmailRequest(expense) {

  
  //Logic to handle the approvers
  const approvers = [];
  expense.project?.projectResource?.map((resource) => {
    if(!approvers.includes({email: resource.user?.email})) {
      approvers.push({email: resource.user?.email})
    }    
  })
  if(!approvers.includes({email: expense.project?.contactEmail})) {
    approvers.push({email: expense.project?.contactEmail})
  }
  const jsonObject = approvers.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: uniqueArray,
    bcc: [{email: expense.user?.email}, {email: expense.project?.vendor?.email}],
    templateData: {
      expense: expense
      // expenseName: expense.name,
      // vendorName: expense.project?.name,
      // projectName: expense.project?.name,      
      // submittedBy: saveTimesheet.user?.firstName+" "+saveTimesheet.user?.lastName,
      // submittedDate: util.getFormattedDate(new Date()),
      // timePeriod: util.getFormattedDate(saveTimesheet.startDate)+" - "+util.getFormattedDate(startPlusWeek),
      // status: saveTimesheet.status
    },
    template_id: EmailConstants.emailTemplate.newExpenseSubmitted
  }

}



function markExpenseDelete(expenseId, accountId) {
  let expenseIDs = [expenseId];
  const data = {status: ExpenseStatus.MarkForDelete};
  return updateExpenseStatus(expenseIDs,data)
}

function updateExpenseStatus(expenseIds, data) {
  return fetchWrapper.put(`${baseUrl}/expense/status/update`, {
    expenseIds: expenseIds,
    data: data
  }
  ).then(expenses => {
    return expenses;
  }).catch(err => {
    console.log("Successfylly Created Invooice But error updating expenses::"+err)
    return {errorMessage: err, error: true};
  });

}

function createExpenseTransaction(formData, accountId) {
  
  //Before Creating, make sure that invoiceTotal is greater than the paid amount and there is room to pay
  return fetchWrapper.get(`${baseUrl}/expense/${formData.expenseId}/detail?accountId=`+accountId, {})
  .then(async expense => {

    //Check if invoie is valid
    if(((formData.status == ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Paid || formData.status == ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.PartiallyPaid || formData.status == ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Pending) && 
      util.getZeroPriceForNull(expense.total) >= (util.getZeroPriceForNull(expense.paidAmount)+util.getZeroPriceForNull(formData.amount)))
      || ((formData.status == ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Refund 
            || formData.status == ExpenseConstants.EXPENSE_TRANSSACTION__STATUS.Cancelled)
          && (util.getZeroPriceForNull(formData.amount)<= (util.getZeroPriceForNull(expense.paidAmount)- util.getZeroPriceForNull(formData.amount))))) {

      return fetchWrapper.post(`${baseUrl}/expense/`+formData.expenseId+`/transaction/create`, {
        amount: formData.amount,
        transactionData: formData.transactionData,
        status: formData.status,
        expenseId: parseInt(formData.expenseId),
        transactionId: formData.transactionId
        }
      )
      .then(async expenseTransaction => {
        //If the expense is successfuly created, then do the math and update the paid amount
        console.log("Succesfully Created the transacton:::"+JSON.stringify(expenseTransaction));
        return expenseTransaction;
      })        
      .catch(err => {
        console.log("Error createExpenseTransaction"+err)
        return {errorMessage: err, error: true};
      });
  
    }else {
      console.log("Error Condition here with the status")
      return {errorMessage: ErrorMessage.EXPENSE_TRANSACTION_ALREADY_PAID, error: true};
    }

  })  
  .catch(err => {
    console.log("Error createExpenseTransaction"+err)
    return {errorMessage: err, error: true};
  });
}

function getExpenseTransactions(expenseId, accountId) {

  return fetchWrapper.get(`${baseUrl}/expense/`+expenseId+'/transactions?accountId='+accountId, {}
  )
  .then(expenseTransactions => {
   return expenseTransactions;
  })
  .catch(err => {
    console.log("Error Getting Expense Transactions::"+err)
    return {errorMessage: err, error: true};
  });

}

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
      // Expense are approved, now adjust the budget based on the billable expenses
      const totalExpenseAmount = util.getTotalBillableExpense(expense.expenseEntries);
      if(totalExpenseAmount != undefined && totalExpenseAmount != EMPTY_STRING) {
        projectService.updateMiscUsedBudget(expense.project?.id, util.getZeroPriceForNull(expense.project?.usedMiscBudget) + util.getZeroPriceForNull(totalExpenseAmount.billableExpense));
      }
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
