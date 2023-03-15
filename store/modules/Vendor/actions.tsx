
import { accountService, userService } from '../../../services';
import { ActionTypes } from './constants';



export const setVendorsByAccount = (vendors) => {
    return {
        type: ActionTypes.SET_VENDORS_BY_ACCOUNT,
        payload: vendors
    }
}

export const getUserVendors = (vendors) => {
    return {
        type: ActionTypes.GET_VENDORS_BY_ACCOUNT,
        payload: vendors
    }
}

export const resetVendorsByAccount = () => {
    return {
        type: ActionTypes.RESET_VENDORS_BY_ACCOUNT,
        payload: []
    }
}

export const fetchVendorsByAccount = (accountId) => {
    return async (dispatch) => {
        const responseData = await accountService.getVendorList(accountId);
        dispatch(getUserVendors(responseData));
      };
}

export const setVendorUsers = (vendorUsers) => {
    return {
        type: ActionTypes.SET_VENDOR_USERS,
        payload: vendorUsers
    }
}

export const resetVendorUsers = () => {
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
    return {
        type: ActionTypes.SET_SELECTED_VENDOR_ID,
        payload: vendorId
    }
}

export const resetSelectedVendorId = () => {
    return {
        type: ActionTypes.RESET_SELECTED_VENDOR_ID,
        payload: null
    }
}
