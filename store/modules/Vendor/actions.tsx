
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

export const setVendorUsers = (vendorUsers) => {
    console.log("setVendorUser::::ACTIONS:::"+JSON.stringify(vendorUsers));
    return {
        type: ActionTypes.SET_VENDOR_USERS,
        payload: vendorUsers
    }
}

export const resetVendorUsers = () => {
    console.log("resetVendorUsers::")
    return {
        type: ActionTypes.RESET_VENDOR_USERS,
        payload: []
    }
}

export const removeUserFromVendorByIndex = (removeIndex) => {
    return {
        type: ActionTypes.REMOVE_USER_FROM_VENDOR_BY_INDEX,
        payload: removeIndex
    }
}

export const setSelectedVendorId = (vendorId) => {
    console.log("setSelectedVendorId::::ACTIONS:::"+JSON.stringify(vendorId));
    return {
        type: ActionTypes.SET_SELECTED_VENDOR_ID,
        payload: vendorId
    }
}

export const resetSelectedVendorId = () => {
    console.log("resetSelectedVendorId::")
    return {
        type: ActionTypes.RESET_SELECTED_VENDOR_ID,
        payload: null
    }
}
