import { ActionTypes } from "./constants";



const initialState = {
    project: {
        selectedReportsProjectId: null
    }
};

const reportsReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if(type === ActionTypes.SET_SELECTED_REPORTS_PROJECT_ID) {
        newState.project.selectedReportsProjectId = payload
    }


    return newState;
};

export default reportsReducer;