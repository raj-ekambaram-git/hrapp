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
    } else if(type === ActionTypes.UPDATE_CONFIGURATION) {
                
        const newAllConfigurations = [...newState.allConfigurations];
        const appConfigToRemoveIndex = newAllConfigurations.findIndex(x => x.id === parseInt(payload.id));
        newAllConfigurations.splice(appConfigToRemoveIndex, 1);
        newAllConfigurations.push(payload);
        newState.allConfigurations = newAllConfigurations;
    }


    return newState;
};

export default configurationReducer;