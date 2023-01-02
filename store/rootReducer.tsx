import { combineReducers } from "@reduxjs/toolkit";

import accountReducer from '../store/modules/Account/reducer';
import vendorReducer from '../store/modules/Vendor/reducer';
import timesheetReducer from '../store/modules/Timesheet/reducer';

const rootReducer = combineReducers({
    timesheet: timesheetReducer,
    
});

export default rootReducer;

