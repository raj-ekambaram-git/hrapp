import { expenseService, projectService,userService } from '../../../services';
import { ActionTypes } from './constants';

export const submitNewExpense = (expense) => ({

    type: ActionTypes.SUBMIT_NEW_EXPENSE,
    payload: expense
});


export const setExpenseEntries = (expenseEntries) => {
    return {
        type: ActionTypes.SET_EXPENSE_ENTRIES,
        payload: expenseEntries
    }
}
export const getPendingApprovalExpenses = (pendingApprovalExpenses) => {
    return {
        type: ActionTypes.GET_APPROVAL_EXPENSES,
        payload: pendingApprovalExpenses
    }
}

export const getPendingPaymentExpenses = (pendingPaymentExpenses) => {
    return {
        type: ActionTypes.GET_PAYMENT_EXPENSES,
        payload: pendingPaymentExpenses
    }
}

export const getAllProjectExpenses = (expenses) => {
    return {
        type: ActionTypes.GET_ALL_PROJECT_EXPENSES,
        payload: expenses
    }
}
export const fetchAllProjectExpenses = (inputParam) => {
    return async (dispatch) => {
        const allProjectExpenses = await projectService.getAllExpensesByProject(inputParam);
        dispatch(getAllProjectExpenses(allProjectExpenses));
      };
}

export const fetchProjectExpensesByStatus = (inputParam) => {
    return async (dispatch) => {
        const projectTimesheeetByStatus = await projectService.getProjectExpensesByStatus(inputParam);
        dispatch(getAllProjectExpenses(projectTimesheeetByStatus));
      };
}

export const fetchExpensesForApproval = (userId, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.getExpenseApprovalByUser(userId, accountId);
        dispatch(getPendingApprovalExpenses(responseData));
      };
}

export const fetchExpensesForPayment = (userId, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.getExpensePaymentByUser(userId, accountId);
        dispatch(getPendingPaymentExpenses(responseData));
      };
}

export const setSelectedExpenseId = (selectedTimeSheetId) => {
    return {
        type: ActionTypes.SET_SELECTED_EXPENSE_ID,
        payload: selectedTimeSheetId
    }
}

export const setSelectedExpenseEntryId = (selectedTimeSheetEntryId) => {
    return {
        type: ActionTypes.SET_SELECTED_EXPENSE_ENTRY_ID,
        payload: selectedTimeSheetEntryId
    }
}

export const setExpenseHeader = (expenseHeader) => {
    return {
        type: ActionTypes.SET_EXPENSE_HEADER,
        payload: expenseHeader
    }
}

export const getExpenseTransactions = (expenseTransaction) => {
    return {
        type: ActionTypes.GET_EXPENSE_TRANSACTIONS,
        payload: expenseTransaction
    }
}

export const fetchExpenseTransactions = (expenseId, accountId) => {
    return async (dispatch) => {
        const responseData = await expenseService.getExpenseTransactions(expenseId, accountId);
        dispatch(getExpenseTransactions(responseData));
      };
}

export const updateExpenseTransactions = (expenseTransaction) => {
    return {
        type: ActionTypes.UPDATE_EXPENSE_TRANSACTIONS,
        payload: expenseTransaction
    }
}

export const setExpensePaidAmount = (expensePaidAmount) => {
    return {
        type: ActionTypes.EXPENSE_PAID_AMOUNT,
        payload: expensePaidAmount
    }
}

export const setExpenseEntryFromPayTrans = (expenseEntryFromPayTrans) => {
    return {
        type: ActionTypes.EXPENSE_ENTRY_FROM_PAYMENT_TRANS,
        payload: expenseEntryFromPayTrans
    }
}

export const setExpenseEntryFromPayTransTotal = (expenseEntryFromPayTransTotal) => {
    return {
        type: ActionTypes.EXPENSE_ENTRY_FROM_PAYMENT_TRANS_TOTAL,
        payload: expenseEntryFromPayTransTotal
    }
}