
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

export const addUserVendor = (userVendorData, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.addUserVendor(userVendorData, accountId);
        console.log("addUserVendor::"+JSON.stringify(responseData))
        dispatch(setUserVendors(responseData));
      };
}

export const removeUserVendorByIndex = (userVendorIndex) => {
    return {
        type: ActionTypes.REMOVE_USER_VENDOR_BY_INDEX,
        payload: userVendorIndex
    }
}

export const setLoggedInUser = (user) => {
    console.log("setLoggedInUser::::ACTIONS:::"+JSON.stringify(user));
    return {
        type: ActionTypes.SET_LOGGED_IN_USER,
        payload: user
    }
}

export const setSelectedUserId = (selectedUserId) => {
    console.log("setSelectedUserId::::ACTIONS:::"+JSON.stringify(selectedUserId));
    return {
        type: ActionTypes.SET_SELECTED_USER_ID,
        payload: selectedUserId
    }
}

export const removeLoggedInUser = () => {
    return {
        type: ActionTypes.REMOVE_LOGGED_IN_USER,
        payload: null
    }
}


export const setAvailableProjectsForUser = (userId) => {
    console.log("setAvailableProjectsForUser::::ACTIONS:::"+JSON.stringify(userId));
    return {
        type: ActionTypes.SET_AVAILABLE_PROJECTS_FOR_USER,
        payload: userId
    }
}

export const getAvailableProjectsForUser = (projects) => {
    console.log("getAvailableProjectsForUser::::ACTIONS:::"+JSON.stringify(projects));
    return {
        type: ActionTypes.GET_AVAILABLE_PROJECTS_FOR_USER,
        payload: projects
    }
}

export const fetchAvailableProjectsForUser = (userId, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.getAvailableProjectsForUser(userId, accountId);
        console.log("fetchAvailableProjectsForUser::"+JSON.stringify(responseData))
        dispatch(getAvailableProjectsForUser(responseData));
      };
}


export const setUserProjects = (userProjects) => {
    console.log("setUserProjects::::ACTIONS:::"+JSON.stringify(userProjects));
    return {
        type: ActionTypes.SET_USER_PROJECTS,
        payload: userProjects
    }
}

export const resetUserProjects = () => {
    return {
        type: ActionTypes.RESET_USER_PROJECTS,
        payload: []
    }
}