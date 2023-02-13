
import { accountService, userService } from '../../../services';
import { ActionTypes } from './constants';


export const setPaymentProducts = (paymentProducts) => {
    return {
        type: ActionTypes.PAYMENT_PRODUCTS,
        payload: paymentProducts
    }
}

export const setPaymentInitiation = (isPaymentInitiation) => {
    return {
        type: ActionTypes.IS_PAYMENT_INITIATION,
        payload: isPaymentInitiation
    }
}

export const setAccountPaymentToken = (paymentToken) => {
    return {
        type: ActionTypes.SET_PAYMENT_TOKEN,
        payload: paymentToken
    }
}

export const setUsersByAccount = (users) => {
    return {
        type: ActionTypes.SET_USERS_BY_ACCOUNT,
        payload: users
    }
}


export const setVendorsByAccount = (vendors) => {
    return {
        type: ActionTypes.SET_VENDORS_BY_ACCOUNT,
        payload: vendors
    }
}

export const getAccountUsers = (users) => {
    return {
        type: ActionTypes.GET_USERS_BY_ACCOUNT,
        payload: users
    }
}

export const resetUsersByAccount = () => {
    return {
        type: ActionTypes.RESET_USERS_BY_ACCOUNT,
        payload: []
    }
}

export const fetchUsersByAccount = (accountId) => {
    return async (dispatch) => {
        const responseData = await accountService.getUserList(accountId);
        dispatch(getAccountUsers(responseData));
      };
}



export const setSelectedAccountId = (accountId) => {
    return {
        type: ActionTypes.SET_SELECTED_ACCOUNT_ID,
        payload: accountId
    }
}

export const resetSelectedAccountId = () => {
    return {
        type: ActionTypes.RESET_SELECTED_ACCOUNT_ID,
        payload: null
    }
}

export const fetchAccountVendors = (accountId) => {
    return async (dispatch) => {
        const responseData = await accountService.getVendorList(accountId);
        console.log("responseData::"+JSON.stringify(responseData))
        dispatch(setVendorsByAccount(responseData));
      };
}

