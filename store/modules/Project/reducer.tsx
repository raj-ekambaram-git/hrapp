import { ActionTypes } from "./constants";



const initialState = {
    selectedProjectId: null,
    projectResources: [],
    vendorId: null,
    remainingBudget: null
};

const projectReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_SELECTED_PROJECT_ID) {
        newState.selectedProjectId = payload;
    } else if(type === ActionTypes.SET_SELECTED_PROJECT_RESOURCES) {
        const newProjectResources = [...newState.projectResources]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.projectResources = payload;
        }else {
            //Add New Condtion or udpate
            newProjectResources.push(payload);
            newState.projectResources = newProjectResources;
        }
    }else if(type === ActionTypes.SET_SELECTED_PROJECT_VENDOR_ID) {
        newState.vendorId = payload;
    } else if(type === ActionTypes.SET_SELECTED_PROJECT_REMAINING_BUDGET) {
        console.log("projectReducer:::New State:::Before Return:::::"+payload)
        newState.remainingBudget = payload;
    } else if(type === ActionTypes.REMOVE_PROJECT_RESOURCE_BY_INDEX) {
        const newProjectResourceList = [...newState.projectResources]
        newProjectResourceList.splice(payload, 1);
        newState.projectResources = newProjectResourceList;
    } else if(type === ActionTypes.UPDATE_PROJECT_RESOURCE_ENTRY) {
        const newProjectResourceList = [...newState.projectResources]
        let updateProjectResource = newProjectResourceList.map(projectResource => {
            if (projectResource.id == payload.id) {
                projectResource = payload
            }
            return projectResource;
          })
        newState.projectResources = updateProjectResource;
    }
    
    // console.log("projectReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default projectReducer;