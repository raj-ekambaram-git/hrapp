import { ActionTypes } from "./constants";



const initialState = {
    allConfigurations: [],
};

const configurationReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if(type === ActionTypes.SET_CONFIGURATIONS) {
        const newConfiguration = [...newState.allConfigurations]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.allConfigurations = payload;
        }else {
            //Add New Condtion or udpate
            newConfiguration.push(payload);
            newState.allConfigurations = newConfiguration;
        }        
    } else if(type === ActionTypes.GET_ALL_CONFIGURATIONS) {
        newState.allConfigurations = payload;
    }


    return newState;
};

export default configurationReducer;