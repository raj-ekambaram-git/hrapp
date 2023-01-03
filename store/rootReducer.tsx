import { combineReducers } from "@reduxjs/toolkit";

import timesheetReducer from '../store/modules/Timesheet/reducer';

const rootReducer = combineReducers({
    timesheet: timesheetReducer,
    
});

export default rootReducer;

