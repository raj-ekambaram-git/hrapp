
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