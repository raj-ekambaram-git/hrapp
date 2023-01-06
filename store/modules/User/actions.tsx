
import { userService } from '../../../services';
import { ActionTypes } from './constants';



export const setUserVendors = (userVendors) => {
    console.log("setUserVendors::::ACTIONS:::"+JSON.stringify(userVendors));
    return {
        type: ActionTypes.SET_USER_VENDORS,
        payload: userVendors
    }
}

export const getUserVendors = (userVendors) => {
    console.log("setUserVendors::::ACTIONS:::"+JSON.stringify(userVendors));
    return {
        type: ActionTypes.GET_USER_VENDORS,
        payload: userVendors
    }
}

export const resetUserVendors = () => {
    return {
        type: ActionTypes.RESET_USER_VENDORS,
        payload: []
    }
}


export const fetchUserVendors = (userId, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.getUserVendors(userId, accountId);
        console.log("fetchUserVendors::"+JSON.stringify(responseData))
        dispatch(getUserVendors(responseData));
      };
}