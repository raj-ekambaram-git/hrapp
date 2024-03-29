import { ActionTypes } from "./constants";



const initialState = {
    project: {
        selectedReportsProjectId: null,
    },
    vendor: {
        selectedReportsVendorId: null
    },
    selectedReportsTabIndex: 0
};

const reportsReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if(type === ActionTypes.SET_SELECTED_REPORTS_PROJECT_ID) {
        newState.project.selectedReportsProjectId = payload
    } else if(type === ActionTypes.SET_SELECTED_REPORTS_VENDOR_ID) {
        newState.vendor.selectedReportsVendorId = payload
    } else if(type === ActionTypes.SET_SELECTED_REPORTS_TAB_INDEX) {
        newState.selectedReportsTabIndex = payload
    }


    return newState;
};

export default reportsReducer;