import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectService } from "../../../services";
import { ActionTypes } from "./constants";



const initialState = {
    expenseEntries: [],
    projectExpenses: [],
    approvalExpenses: [],
    paymentExpenses: [],
    selectedExpenseId: null,
    selectedExpenseEntryId: null,
    expenseHeader: {},
    expenseTransactions: [],
    expensePaidAmount: null,
    paymentTransactions: {
        expenseEntryFromPayTran: [],
        expenseEntryTotal: null

    }
    
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
    } else if (type === ActionTypes.GET_PAYMENT_EXPENSES) {
        if(!payload.error) {
            newState.paymentExpenses = payload;
        }
    }else if(type === ActionTypes.SET_SELECTED_EXPENSE_ENTRY_ID) {
        newState.selectedExpenseEntryId = payload
    } else if(type === ActionTypes.SET_SELECTED_EXPENSE_ID) {
        newState.selectedExpenseId = payload
    } else if(type === ActionTypes.SET_EXPENSE_HEADER) {
        newState.expenseHeader = payload
    } else if(type === ActionTypes.GET_EXPENSE_TRANSACTIONS) {
        newState.expenseTransactions = payload;
    } else if(type === ActionTypes.UPDATE_EXPENSE_TRANSACTIONS) {
        const newExpenseTransactions = [...newState.expenseTransactions]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.expenseTransactions = payload;
        }else {
            //Add New Condtion or udpate
            newExpenseTransactions.push(payload);
            newState.expenseTransactions = newExpenseTransactions;
        }
        
    } else if(type === ActionTypes.EXPENSE_PAID_AMOUNT) {
        newState.expensePaidAmount = parseFloat(payload);
    } else if(type === ActionTypes.EXPENSE_ENTRY_FROM_PAYMENT_TRANS) {
        const newExpenseTransactions = [...newState.paymentTransactions.expenseEntryFromPayTran]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.paymentTransactions.expenseEntryFromPayTran = payload;
        }else {
            //Add New Condtion or udpate
            newExpenseTransactions.push(payload);
            newState.paymentTransactions.expenseEntryFromPayTran = newExpenseTransactions;
        }
    } else if(type === ActionTypes.EXPENSE_ENTRY_FROM_PAYMENT_TRANS_TOTAL) {
        newState.paymentTransactions.expenseEntryTotal = parseFloat(payload);
    }


    return newState;
};

export default expenseReducer;