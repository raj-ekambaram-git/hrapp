
import { workFlowService } from '../../../services';
import { ActionTypes } from './constants';


export const getWorkFlowTasksByAccount = (workFlowTasks) => {
    return {
        type: ActionTypes.SET_WORKFLOW_TASKS_BY_ACCOUNT,
        payload: workFlowTasks
    }
}

export const setWorkFlowTasksByAccount = (workFlowTasks) => {
    return {
        type: ActionTypes.SET_WORKFLOW_TASKS_BY_ACCOUNT,
        payload: workFlowTasks
    }
}

export const fetchWorkFlowTasksByAccount = (accountId) => {
    return async (dispatch) => {
        const responseData = await workFlowService.getTasksByAccount(accountId);
        dispatch(getWorkFlowTasksByAccount(responseData));
      };
}
