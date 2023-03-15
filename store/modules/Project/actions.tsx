import { ActionTypes } from './constants';



export const setSelectedProjectId = (selectedProjectId) => {
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_ID,
        payload: selectedProjectId
    }
}

export const setSelectedProjectResources = (selectedProjectResources) => {
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_RESOURCES,
        payload: selectedProjectResources
    }
}

export const setSelectedProjectRemainingBudget = (remainingBudget) => {
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_REMAINING_BUDGET,
        payload: remainingBudget
    }
}

export const setSelectedProjectVendorId = (vendorId) => {
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_VENDOR_ID,
        payload: vendorId
    }
}

export const removeProjectResourceByIndex = (projectResourceIndex) => {
    return {
        type: ActionTypes.REMOVE_PROJECT_RESOURCE_BY_INDEX,
        payload: projectResourceIndex
    }
}

export const updateProjectResourceEntry = (projectResource) => {
    return {
        type: ActionTypes.UPDATE_PROJECT_RESOURCE_ENTRY,
        payload: projectResource
    }
}