import { ActionTypes } from "./constants";



const initialState = {
    userVendors: [],
    selectedUserId: null,
    loggedInUser: null,
    availableProjectsForUser: [],
    userProjects: []

};

const userReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_USER_VENDORS) {
        console.log("SET_USER_VENDORS INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newUserVendors = [...newState.userVendors]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.userVendors = payload;
        }else {
            //Add New Condtion or udpate
            newUserVendors.push(payload);
            newState.userVendors = newUserVendors;
        }
        
    } else if(type === ActionTypes.GET_USER_VENDORS) {
        newState.userVendors = payload;
    } else if(type === ActionTypes.RESET_USER_VENDORS) {
        newState.userVendors = [];
    } else if(type === ActionTypes.ADD_USER_VENDOR) {
        newState.userVendors.push(payload);
    } else if(type === ActionTypes.REMOVE_USER_VENDOR_BY_INDEX) {
        const newUserVendors = [...newState.userVendors];
        newUserVendors.splice(payload, 1);
        newState.userVendors = newUserVendors;
    } else if(type === ActionTypes.SET_LOGGED_IN_USER) {
        newState.loggedInUser = payload;
    } else if(type === ActionTypes.SET_SELECTED_USER_ID) {
        newState.selectedUserId = payload;
    } else if(type === ActionTypes.REMOVE_LOGGED_IN_USER) {
        newState.loggedInUser = null;
    } else if(type === ActionTypes.SET_AVAILABLE_PROJECTS_FOR_USER) {
        const newProjectsForUser = [...newState.availableProjectsForUser]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.availableProjectsForUser = payload;
        }else {
            //Add New Condtion or udpate
            newProjectsForUser.push(payload);
            newState.availableProjectsForUser = newProjectsForUser;
        }
        
    } else if(type === ActionTypes.GET_AVAILABLE_PROJECTS_FOR_USER) {
        newState.availableProjectsForUser = payload;
    } else if(type === ActionTypes.SET_USER_PROJECTS) {
        console.log("SET_USER_PROJECTS INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newUserProjects = [...newState.userProjects]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.userProjects = payload;
        }else {
            //Add New Condtion or udpate
            newUserProjects.push(payload);
            newState.userProjects = newUserProjects;
        }
        
    } else if(type === ActionTypes.RESET_USER_PROJECTS) {
        newState.userProjects = [];
    }
    
    console.log("userReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default userReducer;