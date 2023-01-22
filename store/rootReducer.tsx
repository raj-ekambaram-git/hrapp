import { combineReducers } from "@reduxjs/toolkit";

import timesheetReducer from '../store/modules/Timesheet/reducer';
import invoiceReducer from "./modules/Invoice/reducer";
import userReducer from "./modules/User/reducer";
import vendorReducer from "./modules/Vendor/reducer";
import accountReducer from "./modules/Account/reducer";
import notesReducer from "./modules/Notes/reducer";
import projectReducer from "./modules/Project/reducer";
import documentReducer from "./modules/Document/reducer";
import expenseReducer from "./modules/Expense/reducer";
import configurationReducer from "./modules/Configuration/reducer"
import reportsReducer from "./modules/Reports/reducer"

const rootReducer = combineReducers({
    timesheet: timesheetReducer,
    invoice: invoiceReducer,
    user: userReducer,
    vendor: vendorReducer,
    account: accountReducer,
    notes: notesReducer,
    project: projectReducer,
    document: documentReducer,
    expense: expenseReducer,
    configuration: configurationReducer,
    reports: reportsReducer
});

export default rootReducer;

