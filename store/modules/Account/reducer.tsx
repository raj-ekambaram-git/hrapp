import { ActionTypes } from "./constants";

const initialState = {
    accountUsers: [],
    selectedAccountId: null,
    accountVendors: []
};

const accountReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_USERS_BY_ACCOUNT) {
        console.log("SET_USERS_BY_ACCOUNT INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newUsersByAccount = [...newState.accountUsers]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.accountUsers = payload;
        }else {
            //Add New Condtion or udpate
            newUsersByAccount.push(payload);
            newState.accountUsers = newUsersByAccount;
        }
        
    } else if(type === ActionTypes.GET_USERS_BY_ACCOUNT) {
        newState.accountUsers = payload;
    } else if(type === ActionTypes.RESET_USERS_BY_ACCOUNT) {
        newState.accountUsers = [];
    } else if(type === ActionTypes.SET_SELECTED_ACCOUNT_ID) {
        newState.selectedAccountId = payload;
    } else if(type === ActionTypes.RESET_SELECTED_ACCOUNT_ID) {
        newState.selectedAccountId = null;
    } else if(type === ActionTypes.SET_VENDORS_BY_ACCOUNT) {
        const newVendorsByAccount = [...newState.accountVendors]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.accountVendors = payload;
        }else {
            //Add New Condtion or udpate
            newVendorsByAccount.push(payload);
            newState.accountVendors = newVendorsByAccount;
        }
        
    } 

    console.log("accountReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default accountReducer;