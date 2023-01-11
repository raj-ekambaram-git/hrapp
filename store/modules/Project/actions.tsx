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
