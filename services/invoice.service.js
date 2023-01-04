import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const invoiceService = {

    createNewInvoice,
    updateInvoice

};

function updateInvoice(formData, invoiceId, invoiceDate, dueDte, invoiceItemList) {
  
  
  let paidAmountValue = 0;
  if(formData.paidAmount != undefined && formData.paidAmount != EMPTY_STRING) {
    paidAmountValue = parseFloat(formData.paidAmount);
  }

  return fetchWrapper.put(`${baseUrl}/account/invoice/`+invoiceId, {
        id: parseInt(invoiceId),
        description: formData.description,
        type: formData.type,
        accountId: parseInt(formData.accountId),
        vendorId: parseInt(formData.vendorId),
        projectId: parseInt(formData.projectId),
        invoiceDate: new Date(invoiceDate.date),
        dueDte: new Date(dueDte.date),
        transactionId: formData.transactionId,
        total: formData.total,
        notes: formData.notes,
        paidAmount: formData.paidAmount,
        status: formData.status,
        paymentTerms: formData.paymentTerms  
      }
  )
  .then(invoice => {

    console.log("Updated Invoice:::"+JSON.stringify(invoice))
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
  .then(invoice => {

    console.log("Created Invoice:::"+JSON.stringify(invoice))
      return invoice;
  })        
  .catch(err => {
    console.log("Error Creating Invoice")
    return {errorMessage: err, error: true};
});
}
