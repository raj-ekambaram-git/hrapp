import { combineReducers } from "@reduxjs/toolkit";

import timesheetReducer from '../store/modules/Timesheet/reducer';
import invoiceReducer from "./modules/Invoice/reducer";
import userReducer from "./modules/User/reducer";
import vendorReducer from "./modules/Vendor/reducer";

const rootReducer = combineReducers({
    timesheet: timesheetReducer,
    invoice: invoiceReducer,
    user: userReducer,
    vendor: vendorReducer
    
});

export default rootReducer;

