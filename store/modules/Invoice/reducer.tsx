import { ActionTypes } from "./constants";



const initialState = {
    invoiceItemList: [],
    projectResources: [],
    invoiceTotal: null,
    invoicePaidAmount: null,
    invoiceTransactions: [],
    invoiceEmailTo: [],
    selectedInvoiceId: null,
    selectedInvoiceTSEId: [],
    selectedInvoiceExpId: [],
};

const invoiceReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_INVOICE_ITEM_LIST) {
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
        newState.selectedInvoiceExpId = [];
        newState.selectedInvoiceTSEId = [];
    } else if(type === ActionTypes.UPDATE_INVOICE_ITEM_LIST_BY_TIMESHEET_ENTRY_ID) {
        const newInvoiceList = [...newState.invoiceItemList]
        const timesheetEntryToUpdateIndex = newInvoiceList.findIndex(x => x.timesheetEntryId === parseInt(payload.timesheetEntryId));
        newInvoiceList[timesheetEntryToUpdateIndex] = payload;
        newState.invoiceItemList = newInvoiceList;         
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
    } else if(type === ActionTypes.REMOVE_EXPENSE_INVOICE_ITEM) {
        
        const newInvoiceList = [...newState.invoiceItemList];
        const expenseToRemoveIndex = newInvoiceList.findIndex(x => x.id === parseInt(payload));
        newInvoiceList.splice(expenseToRemoveIndex, 1);
        newState.invoiceItemList = newInvoiceList;

    } else if(type === ActionTypes.SET_SELECTED_INVOICE_TSE_ITEMS) {
        const newSelectedInvoiceTSEId = [...newState.selectedInvoiceTSEId]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.selectedInvoiceTSEId = payload;
        }else {
            //Add New Condtion or udpate
            newSelectedInvoiceTSEId.push(payload);
            newState.selectedInvoiceTSEId = newSelectedInvoiceTSEId;
        }
    } else if(type === ActionTypes.SET_SELECTED_INVOICE_EXP_ITEMS) {
        const newSelectedInvoiceExpId = [...newState.selectedInvoiceExpId]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.selectedInvoiceExpId = payload;
        }else {
            //Add New Condtion or udpate
            newSelectedInvoiceExpId.push(payload);
            newState.selectedInvoiceExpId = newSelectedInvoiceExpId;
        }
    } else if( type === ActionTypes.REMOVE_SELECTED_INVOICE_TSE_ITEMS) {
        const newSelectedInvoiceTSEId = [...newState.selectedInvoiceTSEId]
        const teseToRemoveIndex = newSelectedInvoiceTSEId.findIndex(x => x === parseInt(payload));
        newSelectedInvoiceTSEId.splice(teseToRemoveIndex, 1);
        newState.selectedInvoiceTSEId = newSelectedInvoiceTSEId;
    } else if( type === ActionTypes.REMOVE_SELECTED_INVOICE_EXP_ITEMS) {
        const newSelectedInvoiceExpId = [...newState.selectedInvoiceExpId]
        const expenseToRemoveIndex = newSelectedInvoiceExpId.findIndex(x => x === parseInt(payload));
        newSelectedInvoiceExpId.splice(expenseToRemoveIndex, 1);
        newState.selectedInvoiceExpId = newSelectedInvoiceExpId;
    }
    return newState;
};

export default invoiceReducer;