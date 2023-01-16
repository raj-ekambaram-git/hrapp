import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectService } from "../../../services";
import { ActionTypes } from "./constants";



const initialState = {
    timesheetReducerTest: "Testing",
    timesheetEntries: [],
    projectTimesheets: [],
    approvalTimesheets: [],
    selectedTimesheetId: null,
    selectedTimesheetEntryId: null,
    newTSWeekStartDimId: null,
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
    } else if(type === ActionTypes.SET_SELECTED_TIMESHEET_ENTRY_ID) {
        newState.selectedTimesheetEntryId = payload
    } else if(type === ActionTypes.SET_SELECTED_TIMESHEET_ID) {
        newState.selectedTimesheetId = payload
    } else if(type === ActionTypes.SET_NEW_TS_WK_START_DIM_ID) {
        newState.newTSWeekStartDimId = payload
    }

    return newState;
};

export default timesheetReducer;