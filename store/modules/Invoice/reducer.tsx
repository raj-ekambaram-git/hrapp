import { ActionTypes } from "./constants";



const initialState = {
    invoiceItemList: [],
    projectResources: []
};

const invoiceReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_INVOICE_ITEM_LIST) {
        console.log("SET_INVOICE_ITEM_LIST INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newInvoiceList = [...newState.invoiceItemList]
        newInvoiceList.push(payload);
        newState.invoiceItemList = newInvoiceList;
    } else if(type === ActionTypes.RESET_INVOICE_ITEM_LIST) {
        newState.invoiceItemList = [];
    } else if( type === ActionTypes.REMOVE_ITEM_INVOICE_ITEM_LIST) {
        const newInvoiceList = [...newState.invoiceItemList]
        newInvoiceList.splice(payload, 1);
        newState.invoiceItemList = newInvoiceList;
    } else if(type === ActionTypes.SET_PROJECT_RESOURCES) {
        newState.projectResources = payload;
    }else if(type === ActionTypes.RESET_PROJECT_RESOURCES) {
        newState.projectResources = [];
    }
    
    console.log("New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default invoiceReducer;