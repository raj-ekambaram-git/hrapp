
import { accountService, userService } from '../../../services';
import { ActionTypes } from './constants';



export const setVendorsByAccount = (vendors) => {
    console.log("setVendorsByAccount::::ACTIONS:::"+JSON.stringify(vendors));
    return {
        type: ActionTypes.SET_VENDORS_BY_ACCOUNT,
        payload: vendors
    }
}

export const getUserVendors = (vendors) => {
    console.log("getUserVendors::::ACTIONS:::"+JSON.stringify(vendors));
    return {
        type: ActionTypes.GET_VENDORS_BY_ACCOUNT,
        payload: vendors
    }
}

export const resetVendorsByAccount = () => {
    console.log("resetVendorsByAccount::")
    return {
        type: ActionTypes.RESET_VENDORS_BY_ACCOUNT,
        payload: []
    }
}

export const fetchVendorsByAccount = (accountId) => {
    return async (dispatch) => {
        const responseData = await accountService.getVendorList(accountId);
        console.log("fetchVendorsByAccount::"+JSON.stringify(responseData))
        dispatch(getUserVendors(responseData));
      };
}