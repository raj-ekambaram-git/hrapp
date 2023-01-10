import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING,TIMESHEET_STATUS } from '../constants/accountConstants';
import { InvoiceConstants} from '../constants/invoiceConstants';
import { ErrorMessage} from '../constants/errorMessage';
import { timesheetService } from './timesheet.service';
import { util } from '../helpers/util';



const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const invoiceService = {

    createNewInvoice,
    updateInvoice,
    getInvoiceTransactions,
    createInvoiceTransaction,
    generateInvoice,
    updateInvoiceEmailTo    

};

function generateInvoice(invoiceId, accountId) {

  return fetchWrapper.get(`${baseUrl}/account/invoice/`+invoiceId+'/generate/detail?accountId='+accountId, {}
  )
  .then(async generateInvoiceDetail => {
    console.log("generateInvoiceDetail::"+JSON.stringify(generateInvoiceDetail))
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
  })
  .catch(err => {
    console.log("Error generateInvoice::"+err)
    return {errorMessage: err, error: true};
  });

}

function createInvoiceTransaction(formData, accountId) {
  console.log("Before calling the ccreateInvoiceTransaction....."+JSON.stringify(formData))
  //Before Creating, make sure that invoiceTotal is greater than the paid amount and there is room to pay
  return fetchWrapper.get(`${baseUrl}/account/invoice/${formData.invoiceId}/detail?accountId=`+accountId, {})
  .then(async invoice => {
    console.log((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund 
      || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled))
    console.log("Inside the createInvoice Transaction fetchin invoice::"+(
      (formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund 
      || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled)
    && (util.getZeroPriceForNull(formData.amount)<util.getZeroPriceForNull(invoice.paidAmount))))
    //Check if invoie is valid
    if(((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Paid || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.PartiallyPaid || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Pending) && 
      util.getZeroPriceForNull(invoice.total) >= (util.getZeroPriceForNull(invoice.paidAmount)+util.getZeroPriceForNull(formData.amount)))
      || ((formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund 
            || formData.status == InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled)
          && (util.getZeroPriceForNull(formData.amount)<= (util.getZeroPriceForNull(invoice.paidAmount)- util.getZeroPriceForNull(formData.amount))))) {
      console.log("Inside more payment needed condition, so creating the transaction")
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
        //Call to updat only if the status is NOT pending
        if(invoiceTransaction.status !== InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Pending)
          updateTotalPaidAmount(invoiceTransaction, invoice);
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
    id: parseInt(invoiceId),
    invoiceEmailTo: invoiceEmailTos
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

function updateInvoice(formData, invoiceId, invoiceDate, dueDte, invoiceItemList, invoiceTotal, invoiceEmailTos) {

  console.log("updateInvoice:: BEFORE::::invoiceItemList:::"+JSON.stringify(invoiceItemList));
  //If current status is not cancelled and one of the timesheetn etntry status is "Invoiced" then throw error
  if((formData.status !== InvoiceConstants.INVOICE_STATUS.Draft
        && formData.status !== InvoiceConstants.INVOICE_STATUS.Cancelled)) {
          const anyInvoiceTSEPresent = invoiceItemList.filter((invoiceItem) => invoiceItem.timesheetEntry?.status == TIMESHEET_STATUS.Invoiced);
          console.log("anyInvoiceTSEPresent:::"+anyInvoiceTSEPresent);
          if(anyInvoiceTSEPresent != undefined && anyInvoiceTSEPresent != EMPTY_STRING && anyInvoiceTSEPresent.length > 0) {
            //Timesheet Entry with Ibvouce status is already present, so throw an error
            return {errorMessage: ErrorMessage.TIMESHEET_ALREADY_INVOICED, error: true};
          }
        }

  const result = invoiceItemList.map((invoiceItem) => delete invoiceItem["timesheetEntry"]);
  console.log("updateInvoice::::result:::"+JSON.stringify(result));
  console.log("updateInvoice::::invoiceItemList:::"+JSON.stringify(invoiceItemList));
  
  let paidAmountValue = 0;
  if(formData.paidAmount != undefined && formData.paidAmount != EMPTY_STRING) {
    paidAmountValue = parseFloat(formData.paidAmount);
  }

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoiceId, {
        id: parseInt(invoiceId),
        description: formData.description,
        type: formData.type,
        accountId: parseInt(formData.accountId),
        invoiceDate: new Date(invoiceDate.date),
        dueDte: new Date(dueDte.date),
        total: invoiceTotal,
        status: formData.status,
        paymentTerms: formData.paymentTerms,  
        invoiceItems: {
          create: invoiceItemList
        },
        invoiceEmailTo: invoiceEmailTos
      }
  )
  .then(invoice => {
    
    console.log("Inside the update service ::"+JSON.stringify(invoice)+"*******invoiceItemList:::"+JSON.stringify(invoiceItemList));
    updateTSEntriesAsInvoiced(invoice, invoiceItemList);
    return invoice;
  })
  .catch(err => {
    console.log("Error Updating Invoice::"+err)
    return {errorMessage: err, error: true};
});
}



function createNewInvoice(formData, invoiceItemList, invoiceDate, dueDte, invoiceEmailTos) {
  console.log("Before calling the create invoice....."+JSON.stringify(formData))
  let paidAmountValue = 0;
  if(formData.paidAmount != undefined && formData.paidAmount != EMPTY_STRING) {
    paidAmountValue = parseFloat(formData.paidAmount);
  }

  return fetchWrapper.post(`${baseUrl}/account/invoice/create`, {
        description: formData.description,
        type: formData.type,
        accountId: parseInt(formData.accountId),
        vendorId: parseInt(formData.vendorId),
        projectId: parseInt(formData.projectId),
        invoiceDate: new Date(invoiceDate.date),
        dueDte: new Date(dueDte.date),
        invoiceItems: {
          create: invoiceItemList
        },
        invoiceEmailTo: invoiceEmailTos,
        total: formData.total,
        status: formData.status,
        paymentTerms: formData.paymentTerms
      }
  )
  .then(async invoice => {

    console.log("Inside the create service ::"+JSON.stringify(invoice)+"*******invoiceItemList:::"+JSON.stringify(invoiceItemList));
    updateTSEntriesAsInvoiced(invoice, invoiceItemList);

      return invoice;
  })        
  .catch(err => {
    console.log("Error Creating Invoice"+err)
    return {errorMessage: err, error: true};
  });
}



async function updateTSEntriesAsInvoiced(invoice, invoiceItemList) {

    //If Invoice Type is Timesheet and the status as submitted, then update timeshee entry status as Invoiced
    if(invoice.type === InvoiceConstants.INVOICE_ITEM_TYPE_TIMESHEET && (invoice.status != InvoiceConstants.INVOICE_STATUS.Draft 
                                                                        && invoice.status != InvoiceConstants.INVOICE_STATUS.Cancelled)) {
          //Get the TImesheetEntries ID as an array
        let tsEntriyIDs = invoiceItemList.map( (item) => item.timesheetEntryId);
        console.log("IDSSS:"+JSON.stringify(tsEntriyIDs));
        const data = {status: TIMESHEET_STATUS.Invoiced};
        const udpateTSEntries = await timesheetService.updateTimesheetEntries(tsEntriyIDs, data);
        if(udpateTSEntries.error) {
          console.log("Error updating the timnesheet etnrries"+udpateTSEntries.errorMessage)
          return {errorMessage: udpateTSEntries.errorMessage, error: true};
        }
      
    }
}
  

async function updateTotalPaidAmount(invoiceTransaction, invoice) {
  console.log("updateTotalPaidAmount::invoiceTransaction::"+JSON.stringify(invoiceTransaction)+"*****INVOICE:::"+JSON.stringify(invoice));

  let finalPaidAmount = 0;
  if(invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Refund
    || invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Cancelled) {
      finalPaidAmount = util.getZeroPriceForNull(invoice.paidAmount)-util.getZeroPriceForNull(invoiceTransaction.amount);
  }else if (invoiceTransaction.status === InvoiceConstants.INVOICE_TRANSSACTION__STATUS.Paid) {
    finalPaidAmount = util.getZeroPriceForNull(invoiceTransaction.amount)+util.getZeroPriceForNull(invoice.paidAmount)
  }

  let udpateStatus = invoice.status;
  if(invoice.total == finalPaidAmount) {
    udpateStatus = InvoiceConstants.INVOICE_STATUS.Paid;
  } else if(finalPaidAmount > 0) {
    udpateStatus = InvoiceConstants.INVOICE_STATUS.PartiallyPaid;
  }

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoice.id, {
      id: invoice.id,
      paidAmount: finalPaidAmount,
      status: udpateStatus
    }
  )
  .then(invoice => {
    //TODO: Update the Project with the revenue status
    return invoice;
  })
  .catch(err => {
    console.log("Error Updating Invoice::"+err)
    return {errorMessage: err, error: true};
  });
}