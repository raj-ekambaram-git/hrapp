import { ActionTypes } from './constants';



export const setSelectedProjectId = (selectedProjectId) => {
    console.log("setSelectedProjectId::::ACTIONS:::"+JSON.stringify(selectedProjectId));
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_ID,
        payload: selectedProjectId
    }
}

export const setSelectedProjectResources = (selectedProjectResources) => {
    console.log("setSelectedProjectResources::::ACTIONS:::"+JSON.stringify(selectedProjectResources));
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_RESOURCES,
        payload: selectedProjectResources
    }
}

export const setSelectedProjectRemainingBudget = (remainingBudget) => {
    console.log("setSelectedProjectRemainingBudget::::ACTIONS:::"+JSON.stringify(remainingBudget));
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_REMAINING_BUDGET,
        payload: remainingBudget
    }
}

export const setSelectedProjectVendorId = (vendorId) => {
    console.log("setSelectedProjectVendorId::::ACTIONS:::"+JSON.stringify(vendorId));
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_VENDOR_ID,
        payload: vendorId
    }
}

export const removeProjectResourceByIndex = (projectResourceIndex) => {
    console.log("removeProjectResourceByIndex::::ACTIONS:::"+JSON.stringify(projectResourceIndex));
    return {
        type: ActionTypes.REMOVE_PROJECT_RESOURCE_BY_INDEX,
        payload: projectResourceIndex
    }
}