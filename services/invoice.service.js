import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING,TIMESHEET_STATUS } from '../constants/accountConstants';
import { InvoiceConstants} from '../constants/invoiceConstants';
import { ErrorMessage} from '../constants/errorMessage';
import { timesheetService } from './timesheet.service';
import { util } from '../helpers/util';
import { emailService } from './email.service';
import { CommonConstants, EmailConstants } from '../constants';
import { expenseService } from './expense.service';
import { InvoiceStatus, TimesheetStatus } from '@prisma/client';




const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const invoiceService = {

    createNewInvoice,
    updateInvoice,
    getInvoiceTransactions,
    createInvoiceTransaction,
    generateInvoice,
    updateInvoiceEmailTo,
    generateInvoiceWithoutDetail,
    sendInvoiceEmail,
    markInvoiceDelete,
    invoicesNotPaid,
    getInvoicePastDueDetails
};

function getInvoicePastDueDetails(accountId, pastDueDays) {

  return fetchWrapper.post(`${baseUrl}/account/invoice/pastdue`, {
    accountId: accountId,
    pastDueDays: pastDueDays
  })
  .then(async invoices => {
    return invoices;
  })        
  .catch(err => {
    console.log("Error getInvoicePastDueDetails"+err)
    return {errorMessage: err, error: true};
  });

}

function invoicesNotPaid(accountId, userId) {

  return fetchWrapper.post(`${baseUrl}/account/invoice/pending`, {
    accountId: accountId,
    userId: userId
  })
  .then(async invoices => {
    return invoices;
  })        
  .catch(err => {
    console.log("Error invoicesNotPaid"+err)
    return {errorMessage: err, error: true};
  });

}

function markInvoiceDelete(invoiceId, accountId) {

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoiceId, {
    invoiceData: {
      id: parseInt(invoiceId),
      status: InvoiceStatus.MarkForDelete
    },
    skipInvoiceItemsUpdate: true
  })
  .then(async invoice => {
    return invoice;
  })        
  .catch(err => {
    console.log("Error markInvoiceDelete"+err)
    return {errorMessage: err, error: true};
  });

}

async function sendInvoiceEmail(invoiceId, accountId){

    return fetchWrapper.get(`${baseUrl}/account/invoice/`+invoiceId+'/generate/detail?accountId='+accountId, {}
    )
    .then(async generateInvoiceDetail => {
      if(generateInvoiceDetail.invoiceEmailTo != undefined && generateInvoiceDetail.invoiceEmailTo != null && generateInvoiceDetail.invoiceEmailTo != EMPTY_STRING) {
          const sendEmailTo = generateInvoiceDetail.invoiceEmailTo;
          const uniqueSendEmailTo = [...new Set(sendEmailTo)];
          const emailTos = uniqueSendEmailTo.map((emailTo) => {
            return {
              "email": emailTo
            }
          });
      
          const invoiceBuffer = await generateInvoice(generateInvoiceDetail.id, generateInvoiceDetail.accountId)
          const buffer = Buffer.from(invoiceBuffer)
          const utf8str = buffer.toString('base64')
      
          emailService.sendEmail({
            withAttachment: true,
            from: CommonConstants.fromEmail,
            to: emailTos,
            templateData: generateInvoiceDetail,
            template_id: EmailConstants.emailTemplate.invoiceTemplateId,
            subject: "Invoice: "+generateInvoiceDetail.id+" created",
            attachments: [
              {
                content: utf8str,
                filename: "Invoice_File_"+generateInvoiceDetail.id+".pdf",
                type: "application/pdf",
                disposition: "attachment"
              }
            ]
          });
          return {message: "Successfully sent email to: "+JSON.stringify(sendEmailTo), error: false};
        } else {
          console.log("NO emials to send")
          return {errorMessage: "Error Sending invoice email.", error: true};
        }

    })
    .catch(err => {
      console.log("Error generateInvoice::"+err)
      return {errorMessage: err, error: true};
    });
  

  

}


function generateInvoiceWithoutDetail(invoiceId) {

  return fetch(`${baseUrl}/account/invoice/${invoiceId}/generate`, {})
  .then( response => {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      
      if (!response.ok) {
          if ([401, 403].includes(response.status) && userService.userValue) {
              // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
              userService.logout();
          }

          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
  })
  .catch(err => {
    return {errorMessage: err, error: true};
  });

}

function generateInvoice(invoiceId, accountId) {

  return fetchWrapper.get(`${baseUrl}/account/invoice/`+invoiceId+'/generate/detail?accountId='+accountId, {}
  )
  .then(async generateInvoiceDetail => {
    return callGenerateInvoiceAPI(generateInvoiceDetail, invoiceId)
  })
  .catch(err => {
    console.log("Error generateInvoice::"+err)
    return {errorMessage: err, error: true};
  });

}

function createInvoiceTransaction(formData, accountId) {
  
  //Before Creating, make sure that invoiceTotal is greater than the paid amount and there is room to pay
  return fetchWrapper.get(`${baseUrl}/account/invoice/${formData.invoiceId}/detail?accountId=`+accountId, {})
  .then(async invoice => {
    console.log((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund 
      || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled))

      //Check if invoie is valid
    if(((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Paid || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.PartiallyPaid || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Pending) && 
      util.getZeroPriceForNull(invoice.total) >= (util.getZeroPriceForNull(invoice.paidAmount)+util.getZeroPriceForNull(formData.amount)))
      || ((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund 
            || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled)
          && (util.getZeroPriceForNull(formData.amount)<= (util.getZeroPriceForNull(invoice.paidAmount)- util.getZeroPriceForNull(formData.amount))))) {

      return fetchWrapper.post(`${baseUrl}/account/invoice/`+formData.invoiceId+`/transaction/create`, {
        amount: formData.amount,
        transactionData: formData.transactionData,
        status: formData.status,
        invoiceId: parseInt(formData.invoiceId),
        transactionId: formData.transactionId
        }
      )
      .then(async invoiceTransaction => {
        //If the invoiceTransaction is successfuly created, then do the math and update the paid amount
        console.log("Succesfully Created the transacton:::"+JSON.stringify(invoiceTransaction));
        return invoiceTransaction;
      })        
      .catch(err => {
        console.log("Error createInvoiceTransaction"+err)
        return {errorMessage: err, error: true};
      });
  
    }else {
      console.log("Error Condition here with the status")
      return {errorMessage: ErrorMessage.INVOICE_TRANSACTION_ALREADY_PAID, error: true};
    }

  })  
  .catch(err => {
    console.log("Error createInvoiceTransaction"+err)
    return {errorMessage: err, error: true};
  });
}

function getInvoiceTransactions(invoiceId, accountId) {
  console.log("getInvoiceTransactions:: INVOICE ID:::"+invoiceId+"*****ACCOUNTID::"+accountId);
  return fetchWrapper.get(`${baseUrl}/account/invoice/`+invoiceId+'/transactions?accountId='+accountId, {}
  )
  .then(invoiceTransactions => {
    console.log("Inside the getInvoiceTransactions service ::"+JSON.stringify(invoiceTransactions));
    return invoiceTransactions;
  })
  .catch(err => {
    console.log("Error Getting Invoice::"+err)
    return {errorMessage: err, error: true};
  });

}

function updateInvoiceEmailTo(invoiceId, invoiceEmailTos) {

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoiceId, {
    invoiceData: {
      id: parseInt(invoiceId),
      invoiceEmailTo: invoiceEmailTos      
    },
    skipInvoiceItemsUpdate: true
  })
  .then(invoice => {
    console.log("Inside the updateInvoiceEmailTo service ::"+JSON.stringify(invoice)+"*******invoiceEmailTos:::"+JSON.stringify(invoiceEmailTos));
    return invoice;
  })
  .catch(err => {
    console.log("Error Updating Invoice::"+err)
    return {errorMessage: err, error: true};
  });

}

function updateInvoice(formData, invoiceId, invoiceDate, dueDte, invoiceItemList, invoiceTotal, invoiceEmailTos, projectTimesheeetList) {

  // console.log("updateInvoice:: BEFORE::::invoiceItemList:::"+JSON.stringify(formData)+"*******"+invoiceDate+"*****projectTimesheeetList:::"+JSON.stringify(projectTimesheeetList));
  //If current status is not cancelled and one of the timesheetn etntry status is "Invoiced" then throw error
  if((formData.status !== InvoiceConstants.INVOICE_STATUS.Draft
        && formData.status !== InvoiceConstants.INVOICE_STATUS.Cancelled)) {
          const anyInvoiceTSEPresent = invoiceItemList.filter((invoiceItem) => invoiceItem.timesheetEntry?.status == TIMESHEET_STATUS.Invoiced);
          if(anyInvoiceTSEPresent != undefined && anyInvoiceTSEPresent != EMPTY_STRING && anyInvoiceTSEPresent.length > 0) {
            //Timesheet Entry with Ibvouce status is already present, so throw an error
            return {errorMessage: ErrorMessage.TIMESHEET_ALREADY_INVOICED, error: true};
          }
        }

  const result = invoiceItemList.map((invoiceItem) => delete invoiceItem["timesheetEntry"]);
  invoiceItemList.map((invoiceItem) => delete invoiceItem["user"]);
  invoiceItemList.map((invoiceItem) => delete invoiceItem["expense"]);

  let paidAmountValue = 0;
  if(formData.paidAmount != undefined && formData.paidAmount != EMPTY_STRING) {
    paidAmountValue = parseFloat(formData.paidAmount);
  }

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoiceId, {
        invoiceData: {
          id: parseInt(invoiceId),
          description: formData.description,
          type: formData.type,
          accountId: parseInt(formData.accountId),
          invoiceDate: new Date(invoiceDate),
          dueDte: new Date(dueDte),
          total: invoiceTotal,
          status: formData.status,
          paymentTerms: formData.paymentTerms,  
          invoiceEmailTo: invoiceEmailTos
        },
        invoiceItems: invoiceItemList
      }
  )
  .then(invoice => {

    if(!invoice.error) {
      updateInvoiceItemStatus(invoice, invoiceItemList, projectTimesheeetList);
      if((invoice.status != undefined && (invoice.status === InvoiceConstants.INVOICE_STATUS.Submitted
        || invoice.status === InvoiceConstants.INVOICE_STATUS.Cancelled))) {
          const responseData = sendInvoiceEmail(invoice.id, invoice.accountId);
      }
    }
    return invoice;
  })
  .catch(err => {
    console.log("Error Updating Invoice::"+err)
    return {errorMessage: err, error: true};
});
}



function createNewInvoice(formData, invoiceItemList, invoiceDate, dueDte, invoiceEmailTos, workFlow, projectTimesheeetList) {
  let paidAmountValue = 0;
  if(formData.paidAmount != undefined && formData.paidAmount != EMPTY_STRING) {
    paidAmountValue = parseFloat(formData.paidAmount);
  }

  return fetchWrapper.post(`${baseUrl}/account/invoice/create`, {
    createData: {
        description: formData.description,
        type: formData.type,
        accountId: parseInt(formData.accountId),
        vendorId: parseInt(formData.vendorId),
        projectId: parseInt(formData.projectId),
        invoiceDate: new Date(invoiceDate),
        dueDte: new Date(dueDte),
        invoiceItems: {
          create: invoiceItemList
        },
        invoiceEmailTo: invoiceEmailTos,
        total: formData.total,
        status: formData.status,
        paymentTerms: formData.paymentTerms,
        workFlowEnabled: formData.workFlowEnabled?true:false
      },
      workFlow
    }
  )
  .then(async invoice => {

    // console.log("Inside the create service ::"+JSON.stringify(invoice)+"*******invoiceItemList:::"+JSON.stringify(invoiceItemList)+"********projectTimesheeetList:::"+JSON.stringify(projectTimesheeetList));
    if(!invoice.error) {
      updateInvoiceItemStatus(invoice, invoiceItemList, projectTimesheeetList);
      if((invoice.status != undefined && (invoice.status === InvoiceConstants.INVOICE_STATUS.Submitted
        || invoice.status === InvoiceConstants.INVOICE_STATUS.Cancelled))) {
          const responseData = sendInvoiceEmail(invoice.id, invoice.accountId);
      }
    }
    

      return invoice;
  })        
  .catch(err => {
    console.log("Error Creating Invoice"+err)
    return {errorMessage: err, error: true};
  });
}

async function updateInvoiceItemStatus(invoice, invoiceItemList, projectTimesheeetList) {


    let tsEntriyIDs = [];
    let timesheetEntriesToUpdate = [];
    invoiceItemList.map( (item) => {
      if(item.timesheetEntryId != null && item.timesheetEntryId != undefined) {
        tsEntriyIDs.push(item.timesheetEntryId)
       const fullTimesheetEntryList = projectTimesheeetList.filter(timesheetEntry => timesheetEntry.id === item.timesheetEntryId)

      //  console.log("fullTimesheetEntryList:::"+JSON.stringify(fullTimesheetEntryList[0]))

       if(fullTimesheetEntryList && fullTimesheetEntryList.length>0) {
        const entries = {...fullTimesheetEntryList[0].entries}
        if(item.detail) {
          item.detail.map(dtl => {
            entries[dtl.day]["status"] = TimesheetStatus.Invoiced
          })
        }
        const timesheetEntryToUpdate = {
          id: item.timesheetEntryId,
          entries: entries,
          status: util.isTimesheetEntryFullyUpdated(entries, TimesheetStatus.Invoiced)?TimesheetStatus.Invoiced:TimesheetStatus.PartiallyInvoiced
        }
        timesheetEntriesToUpdate.push(timesheetEntryToUpdate)
       }
      }
    });

    let expenseIDs = [];
    invoiceItemList.map( (item) => {
      if(item.expenseId != null && item.expenseId != undefined) {
          expenseIDs.push(item.expenseId)
      }
    });

    const data = {status: TIMESHEET_STATUS.Invoiced};

    if(tsEntriyIDs && tsEntriyIDs.length > 0) {
      if((invoice.type === InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET || invoice.type === InvoiceConstants.INVOICE_ITEM_TYPE_PROJECT) && (invoice.status != InvoiceConstants.INVOICE_STATUS.Draft 
        && invoice.status != InvoiceConstants.INVOICE_STATUS.Cancelled)) {

          //Construct the data object in an array to update the timesheet entries

          const udpateTSEntries = await timesheetService.updateTimesheetStatusDataEntries(timesheetEntriesToUpdate);
          if(udpateTSEntries.error) {
            return {errorMessage: udpateTSEntries.errorMessage, error: true};
          }
        }
    }
    
    if(expenseIDs && expenseIDs.length > 0) {
      if((invoice.type === InvoiceConstants.INVOICE_ITEM_TYPE_EXPENSE || invoice.type === InvoiceConstants.INVOICE_ITEM_TYPE_PROJECT) && (invoice.status != InvoiceConstants.INVOICE_STATUS.Draft 
        && invoice.status != InvoiceConstants.INVOICE_STATUS.Cancelled)) {
          const updateExpense = await expenseService.updateExpenseStatus(expenseIDs, data);
          if(updateExpense.error) {
            return {errorMessage: updateExpense.errorMessage, error: true};
          }
        }
    }

}


async function callGenerateInvoiceAPI(generateInvoiceDetail, invoiceId) {
  const authHeader = JSON.stringify(fetchWrapper.authHeader(`${baseUrl}/account/invoice/${invoiceId}/generate`));
  const data = await fetch(`${baseUrl}/account/invoice/${invoiceId}/generate`, {
    method: 'POST',
    body: JSON.stringify(generateInvoiceDetail),
    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader},
  });
  // convert the response into an array Buffer
  if(data.arrayBuffer) {
    return data.arrayBuffer();
  }else {
    return {errorMessage: "Error generateInvoice", error: true};
  }
}