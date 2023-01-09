
import { accountService, userService } from '../../../services';
import { ActionTypes } from './constants';



export const setUsersByAccount = (users) => {
    console.log("setUsersByAccount::::ACTIONS:::"+JSON.stringify(users));
    return {
        type: ActionTypes.SET_USERS_BY_ACCOUNT,
        payload: users
    }
}

export const getAccountUsers = (users) => {
    console.log("getAccountUsers::::ACTIONS:::"+JSON.stringify(users));
    return {
        type: ActionTypes.GET_USERS_BY_ACCOUNT,
        payload: users
    }
}

export const resetUsersByAccount = () => {
    console.log("resetUsersByAccount::")
    return {
        type: ActionTypes.RESET_USERS_BY_ACCOUNT,
        payload: []
    }
}

export const fetchUsersByAccount = (accountId) => {
    return async (dispatch) => {
        const responseData = await accountService.getUserList(accountId);
        console.log("fetchUsersByAccount::"+JSON.stringify(responseData))
        dispatch(getAccountUsers(responseData));
      };
}



export const setSelectedAccountId = (accountId) => {
    console.log("setSelectedAccountId::::ACTIONS:::"+JSON.stringify(accountId));
    return {
        type: ActionTypes.SET_SELECTED_ACCOUNT_ID,
        payload: accountId
    }
}

export const resetSelectedAccountId = () => {
    console.log("resetSelectedAccountId::")
    return {
        type: ActionTypes.RESET_SELECTED_ACCOUNT_ID,
        payload: null
    }
}