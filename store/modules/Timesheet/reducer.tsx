import { ActionTypes } from "./constants";


const initialState = {
    timesheetReducerTest: "Testing"
};

const timesheetReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SUBMIT_NEW_TIMESHEET) {
        console.log("inside ghe siubmit");
        newState.timesheetReducerTest = payload;
    }else  if (type === 'SECOND_SUBMIT') {
        newState.timesheetReducerTest = "second submit updated testing";
    }

    return newState;
};

export default timesheetReducer;