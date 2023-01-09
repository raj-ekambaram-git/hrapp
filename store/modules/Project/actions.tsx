import { ActionTypes } from './constants';



export const setSelectedProjectId = (selectedProjectId) => {
    console.log("setSelectedProjectId::::ACTIONS:::"+JSON.stringify(selectedProjectId));
    return {
        type: ActionTypes.SET_SELECTED_PROJECT_ID,
        payload: selectedProjectId
    }
}
