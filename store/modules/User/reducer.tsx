import { ActionTypes } from "./constants";



const initialState = {
    userVendors: [],

};

const userReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_USER_VENDORS) {
        console.log("SET_USER_VENDORS INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newUserVendors = [...newState.userVendors]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.userVendors = payload;
        }else {
            //Add New Condtion or udpate
            newUserVendors.push(payload);
            newState.userVendors = newUserVendors;
        }
        
    } else if(type === ActionTypes.GET_USER_VENDORS) {
        newState.userVendors = payload;
    } else if(type === ActionTypes.RESET_USER_VENDORS) {
        newState.userVendors = [];
    }
    
    console.log("userReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default userReducer;