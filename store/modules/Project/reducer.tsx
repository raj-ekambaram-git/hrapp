import { ActionTypes } from "./constants";



const initialState = {
    selectedProjectId: null

};

const projectReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_SELECTED_PROJECT_ID) {
        newState.selectedProjectId = payload;
    }
    
    console.log("projectReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default projectReducer;