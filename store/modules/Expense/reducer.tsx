import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectService } from "../../../services";
import { ActionTypes } from "./constants";



const initialState = {
    expenseEntries: [],
    projectExpenses: [],
    approvalExpenses: [],
    selectedExpenseId: null,
    selectedExpenseEntryId: null,
    expenseHeader: {},
};

const expenseReducer = (state = initialState, {type, payload}) => {
    const newState = {...state}; 

    if (type === ActionTypes.SET_EXPENSE_ENTRIES) {
        newState.expenseEntries = payload;
    } else if (type === ActionTypes.GET_ALL_PROJECT_EXPENSES) {
        if(!payload.error) {
            newState.projectExpenses = payload;
        }
    } else if (type === ActionTypes.GET_APPROVAL_EXPENSES) {
        if(!payload.error) {
            newState.approvalExpenses = payload;
        }
    } else if(type === ActionTypes.SET_SELECTED_EXPENSE_ENTRY_ID) {
        newState.selectedExpenseEntryId = payload
    } else if(type === ActionTypes.SET_SELECTED_EXPENSE_ID) {
        newState.selectedExpenseId = payload
    } else if(type === ActionTypes.SET_EXPENSE_HEADER) {
        newState.expenseHeader = payload
    }


    return newState;
};

export default expenseReducer;