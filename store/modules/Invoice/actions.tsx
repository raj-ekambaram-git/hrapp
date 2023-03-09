
import { invoiceService } from '../../../services';
import { ActionTypes } from './constants';



export const setInvoiceItemList = (invoiceItemList) => {
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

export const removeTSFromSelectedTSE = (tseId) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_INVOICE_TSE_ITEMS,
        payload: tseId
    }
}

export const removeExpFromSelectedExp = (expId) => {
    return {
        type: ActionTypes.REMOVE_SELECTED_INVOICE_EXP_ITEMS,
        payload: expId
    }
}
export const removeExpenseFromInvoiceItems = (expenseId) => {
    return {
        type: ActionTypes.REMOVE_EXPENSE_INVOICE_ITEM,
        payload: expenseId
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
        dispatch(getInvoiceTransactions(responseData));
      };
}

export const setInvoiceEmailTo = (invoiceEmailTo) => {
    return {
        type: ActionTypes.SET_INVOICE_EMAIL_TO,
        payload: invoiceEmailTo
    }
}

export const resetInvoiceEmailTo = () => {
    return {
        type: ActionTypes.RESET_INVOICE_EMAIL_TO,
        payload: []
    }
}

export const removeEmailFromInvoiceEmailList = (email) => {
    return {
        type: ActionTypes.REMOVE_EMAIL_TO_FROM_LIST,
        payload: email
    }
}

export const removeEmailFromInvoiceEmailListByIndex = (emailIndex) => {
    return {
        type: ActionTypes.REMOVE_EMAIL_TO_FROM_LIST_BY_INDEX,
        payload: emailIndex
    }
}

export const setSelectedInvoiceId = (selectedInvoiceId) => {
    return {
        type: ActionTypes.SET_SELECTED_INVOICE_ID,
        payload: selectedInvoiceId
    }
}

export const setSelectedInvoiceTSEId = (selectedInvoiceTSEId) => {
    return {
        type: ActionTypes.SET_SELECTED_INVOICE_TSE_ITEMS,
        payload: selectedInvoiceTSEId
    }
}

export const setSelectedInvoiceExpId = (selectedInvoiceExpId) => {
    return {
        type: ActionTypes.SET_SELECTED_INVOICE_EXP_ITEMS,
        payload: selectedInvoiceExpId
    }
}

export const updateInvoiceItemListByTimesheetEntryId = (invoiceItemList) => {
    return {
        type: ActionTypes.UPDATE_INVOICE_ITEM_LIST_BY_TIMESHEET_ENTRY_ID,
        payload: invoiceItemList
    }
}