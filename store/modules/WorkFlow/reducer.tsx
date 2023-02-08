import { ActionTypes } from "./constants";


const initialState = {
    tasks: [],
    type: {},
};

const workFlowReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_WORKFLOW_TASKS_BY_ACCOUNT) {
        const newWorkFlowTasks = [...newState.tasks]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.tasks = payload;
        }else {
            //Add New Condtion or udpate
            newWorkFlowTasks.unshift(payload);
            newState.tasks = newWorkFlowTasks;
        }
        
    }

    console.log("workFlowReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default workFlowReducer;