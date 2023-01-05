
import { invoiceService } from '../../../services';
import { ActionTypes } from './constants';



export const setInvoiceItemList = (invoiceItemList) => {
    console.log("invoiceItemList::::ACTIONS:::"+JSON.stringify(invoiceItemList));
    return {
        type: ActionTypes.SET_INVOICE_ITEM_LIST,
        payload: invoiceItemList
    }
}


export const resetInvoiceItemList = () => {
    return {
        type: ActionTypes.RESET_INVOICE_ITEM_LIST,
        payload: []
    }
}

export const removeItemFromInvoiceItemList = (removeIndex) => {
    return {
        type: ActionTypes.REMOVE_ITEM_INVOICE_ITEM_LIST,
        payload: removeIndex
    }
}

export const setProjectResources = (projectResources) => {
    console.log("ACTION :::projectResources::"+projectResources)
    return {
        type: ActionTypes.SET_PROJECT_RESOURCES,
        payload: projectResources
    }
}

export const resetProjectResources = () => {
    return {
        type: ActionTypes.RESET_PROJECT_RESOURCES,
        payload: []
    }
}

export const setInvoiceTotal = (invoiceTotal) => {
    return {
        type: ActionTypes.SET_INVOICE_TOTAL,
        payload: invoiceTotal
    }
}

export const removeTSFromInvoiceItems = (timesheetEntryId) => {
    return {
        type: ActionTypes.REMOVE_TS_INVOICE_ITEM,
        payload: timesheetEntryId
    }
}

export const setInvoicePaidAmount = (invoicePaidAmount) => {
    return {
        type: ActionTypes.INVOICE_PAID_AMOUNT,
        payload: invoicePaidAmount
    }
}

export const setInvoiceTransactions = (invoiceTransactions) => {
    return {
        type: ActionTypes.SET_INVOICE_TRANSACTIONS,
        payload: invoiceTransactions
    }
}

export const getInvoiceTransactions = (invoiceId) => {
    return {
        type: ActionTypes.GET_INVOICE_TRANSACTIONS,
        payload: invoiceId
    }
}

export const updateInvoiceTransactions = (invoiceTransaction) => {
    return {
        type: ActionTypes.UPDATE_INVOICE_TRANSACTIONS,
        payload: invoiceTransaction
    }
}

export const fetchInvoiceTransactions = (invoiceId, accountId) => {
    return async (dispatch) => {
        const responseData = await invoiceService.getInvoiceTransactions(invoiceId, accountId);
        console.log("fetchInvoiceTransactions::"+JSON.stringify(responseData))
        dispatch(getInvoiceTransactions(responseData));
      };
}