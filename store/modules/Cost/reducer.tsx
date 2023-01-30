import { ActionTypes } from "./constants";



const initialState = {
    accountCosts: [],
};

const costReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if (type === ActionTypes.GET_ALL_ACCOUNT_COSTS) {
        if(!payload.error) {
            newState.accountCosts = payload;
        }
    } 

    return newState;
};

export default costReducer;