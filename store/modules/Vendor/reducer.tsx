import { ActionTypes } from "./constants";

const initialState = {
    vendorsByAccount: [],
    vendorUsers: []
};

const vendorReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_VENDORS_BY_ACCOUNT) {
        console.log("SET_VENDORS_BY_ACCOUNT INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newVendorsByAccount = [...newState.vendorsByAccount]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.vendorsByAccount = payload;
        }else {
            //Add New Condtion or udpate
            newVendorsByAccount.push(payload);
            newState.vendorsByAccount = newVendorsByAccount;
        }
        
    } else if(type === ActionTypes.GET_VENDORS_BY_ACCOUNT) {
        newState.vendorsByAccount = payload;
    } else if(type === ActionTypes.RESET_VENDORS_BY_ACCOUNT) {
        newState.vendorsByAccount = [];
    } else if(type === ActionTypes.SET_VENDOR_USERS) {
        const newVendorUsers = [...newState.vendorUsers]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.vendorUsers = payload;
        }else {
            //Add New Condtion or udpate
            newVendorUsers.push(payload);
            newState.vendorUsers = newVendorUsers;
        }
    } else if(type === ActionTypes.RESET_VENDOR_USERS) {
        newState.vendorUsers = [];
    } else if(type === ActionTypes.REMOVE_USER_FROM_VENDOR_BY_INDEX) {
        const newVendorUsers = [...newState.vendorUsers];
        newVendorUsers.splice(payload, 1);
        newState.vendorUsers = newVendorUsers;
    }
    
    console.log("vendorReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default vendorReducer;