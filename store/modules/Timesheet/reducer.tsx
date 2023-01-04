import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectService } from "../../../services";
import { ActionTypes } from "./constants";



const initialState = {
    timesheetReducerTest: "Testing",
    timesheetEntries: [],
    projectTimesheets: [],
    approvalTimesheets: []
};

const timesheetReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if(type === ActionTypes.SUBMIT_NEW_TIMESHEET) {
        newState.timesheetReducerTest = payload;
    } else if (type === ActionTypes.SET_TIMESHEET_ENTRIES) {
        newState.timesheetEntries = payload;
    } else if (type === ActionTypes.GET_ALL_PROJECT_TIMESHEETS) {
        if(!payload.error) {
            newState.projectTimesheets = payload;
        }
    } else if (type === ActionTypes.GET_APPROVAL_TIMESHEETS) {
        if(!payload.error) {
            newState.approvalTimesheets = payload;
        }
    } 

    return newState;
};

export default timesheetReducer;