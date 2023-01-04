import { combineReducers } from "@reduxjs/toolkit";

import timesheetReducer from '../store/modules/Timesheet/reducer';
import invoiceReducer from "./modules/Invoice/reducer";

const rootReducer = combineReducers({
    timesheet: timesheetReducer,
    invoice: invoiceReducer
    
});

export default rootReducer;

