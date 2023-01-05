import { EMPTY_STRING } from "../../../constants/accountConstants";
import { ActionTypes } from "./constants";



const initialState = {
    invoiceItemList: [],
    projectResources: [],
    invoiceTotal: null,
    invoicePaidAmount: null
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
        console.log("Index of TS Entry ID::"+payload+"----"+timesheetEntryToRemoveIndex);
        newInvoiceList.splice(timesheetEntryToRemoveIndex, 1);
        newState.invoiceItemList = newInvoiceList;

    } else if(type === ActionTypes.INVOICE_PAID_AMOUNT) {
        newState.invoicePaidAmount = parseFloat(payload);
    }
    
    console.log("New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default invoiceReducer;