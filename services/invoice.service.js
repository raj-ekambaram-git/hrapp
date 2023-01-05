import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING,TIMESHEET_STATUS } from '../constants/accountConstants';
import { InvoiceConstants} from '../constants/invoiceConstants';
import { ErrorMessage} from '../constants/errorMessage';
import { timesheetService } from './timesheet.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const invoiceService = {

    createNewInvoice,
    updateInvoice

};

function updateInvoice(formData, invoiceId, invoiceDate, dueDte, invoiceItemList, invoiceTotal) {

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
        transactionId: formData.transactionId,
        total: invoiceTotal,
        notes: formData.notes,
        paidAmount: formData.paidAmount,
        status: formData.status,
        paymentTerms: formData.paymentTerms,  
        invoiceItems: {
          create: invoiceItemList
        }
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



function createNewInvoice(formData, invoiceItemList, invoiceDate, dueDte) {
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
        transactionId: formData.transactionId,
        total: formData.total,
        notes: formData.notes,
        paidAmount: paidAmountValue,
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
  
