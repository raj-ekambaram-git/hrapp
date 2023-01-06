import { ActionTypes } from "./constants";

const initialState = {
    vendorsByAccount: []
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
    }
    
    console.log("vendorReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default vendorReducer;