import { ActionTypes } from "./constants";


const initialState = {
    timesheetReducerTest: "Testing",
    timesheetEntries: []
};

const timesheetReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SUBMIT_NEW_TIMESHEET) {
        console.log("inside ghe siubmit");
        newState.timesheetReducerTest = payload;
    } else if (type === ActionTypes.SET_TIMESHEET_ENTRIES) {
        newState.timesheetEntries = payload;
    }

    return newState;
};

export default timesheetReducer;