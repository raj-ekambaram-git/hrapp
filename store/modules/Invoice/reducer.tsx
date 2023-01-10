import { ActionTypes } from "./constants";



const initialState = {
    invoiceItemList: [],
    projectResources: [],
    invoiceTotal: null,
    invoicePaidAmount: null,
    invoiceTransactions: [],
    invoiceEmailTo: [],
    selectedInvoiceId: null
};

const invoiceReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_INVOICE_ITEM_LIST) {
        console.log("SET_INVOICE_ITEM_LIST INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newInvoiceList = [...newState.invoiceItemList]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.invoiceItemList = payload;
        }else {
            //Add New Condtion or udpate
            newInvoiceList.push(payload);
            newState.invoiceItemList = newInvoiceList;
        }
        
    } else if(type === ActionTypes.RESET_INVOICE_ITEM_LIST) {
        newState.invoiceItemList = [];
        newState.invoiceTotal = null;
    } else if( type === ActionTypes.REMOVE_ITEM_INVOICE_ITEM_LIST) {
        const newInvoiceList = [...newState.invoiceItemList]
        newInvoiceList.splice(payload, 1);
        newState.invoiceItemList = newInvoiceList;
    } else if(type === ActionTypes.SET_PROJECT_RESOURCES) {
        newState.projectResources = payload;
    } else if(type === ActionTypes.RESET_PROJECT_RESOURCES) {
        newState.projectResources = [];
    } else if(type === ActionTypes.SET_INVOICE_TOTAL) {
        newState.invoiceTotal = parseFloat(payload);
    } else if(type === ActionTypes.REMOVE_TS_INVOICE_ITEM) {
        
        const newInvoiceList = [...newState.invoiceItemList];
        const timesheetEntryToRemoveIndex = newInvoiceList.findIndex(x => x.id === parseInt(payload));
        newInvoiceList.splice(timesheetEntryToRemoveIndex, 1);
        newState.invoiceItemList = newInvoiceList;

    } else if(type === ActionTypes.INVOICE_PAID_AMOUNT) {
        newState.invoicePaidAmount = parseFloat(payload);
    } else if(type === ActionTypes.GET_INVOICE_TRANSACTIONS) {
        newState.invoiceTransactions = payload;
    } else if(type === ActionTypes.SET_INVOICE_TRANSACTIONS) {
        
    } else if(type === ActionTypes.UPDATE_INVOICE_TRANSACTIONS) {
        const newInvoiceTransactions = [...newState.invoiceTransactions]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.invoiceTransactions = payload;
        }else {
            //Add New Condtion or udpate
            newInvoiceTransactions.push(payload);
            newState.invoiceTransactions = newInvoiceTransactions;
        }
        
    } else if(type === ActionTypes.SET_INVOICE_EMAIL_TO) {
        console.log("newState.invoiceEmailTo::"+JSON.stringify(newState.invoiceEmailTo))
        const newInvoiceEmailToList = [...newState.invoiceEmailTo]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.invoiceEmailTo = payload;
        }else {
            //Add New Condtion or udpate
            newInvoiceEmailToList.push(payload);
            newState.invoiceEmailTo = newInvoiceEmailToList;
        }
    } else if(type === ActionTypes.RESET_INVOICE_EMAIL_TO) {
        newState.invoiceEmailTo = [];
    } else if(type === ActionTypes.REMOVE_EMAIL_TO_FROM_LIST) {
        const newInvoiceEmailToList = [...newState.invoiceEmailTo];
        const emailToRemoveIndex = newInvoiceEmailToList.findIndex(x => x === payload);
        newInvoiceEmailToList.splice(emailToRemoveIndex, 1);
        newState.invoiceEmailTo = newInvoiceEmailToList;
    } else if(type === ActionTypes.REMOVE_EMAIL_TO_FROM_LIST_BY_INDEX) {
        const newInvoiceEmailToList = [...newState.invoiceEmailTo];
        newInvoiceEmailToList.splice(payload, 1);
        newState.invoiceEmailTo = newInvoiceEmailToList;

    } else if(type === ActionTypes.SET_SELECTED_INVOICE_ID) {
        newState.selectedInvoiceId = payload;
    }
    
    console.log("New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default invoiceReducer;