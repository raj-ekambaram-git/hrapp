import { projectService,userService } from '../../../services';
import { ActionTypes } from './constants';

export const submitNewTimesheet = (timsheet) => ({

    type: ActionTypes.SUBMIT_NEW_TIMESHEET,
    payload: timsheet
});


export const setTSEntries = (timesheetEntries) => {
    return {
        type: ActionTypes.SET_TIMESHEET_ENTRIES,
        payload: timesheetEntries
    }
}
export const getPendingApprovalTimesheets = (pendingApprovalTimesheets) => {
    return {
        type: ActionTypes.GET_APPROVAL_TIMESHEETS,
        payload: pendingApprovalTimesheets
    }
}

export const getAllProjectTimesheets = (timesheets) => {
    return {
        type: ActionTypes.GET_ALL_PROJECT_TIMESHEETS,
        payload: timesheets
    }
}
export const fetchAllProjectTimesheets = (inputParam) => {
    return async (dispatch) => {
        const allProjectTimesheets = await projectService.getAllTimesheetsByProject(inputParam);
        dispatch(getAllProjectTimesheets(allProjectTimesheets));
      };
}

export const fetchProjectTimesheetsByStatus = (inputParam) => {
    return async (dispatch) => {
        const projectTimesheeetByStatus = await projectService.getProjectTimesheetsByStatus(inputParam);
        dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      };
}

export const fetchTimesheetsForApproval = (userId, accountId) => {
    return async (dispatch) => {
        const responseData = await userService.getTimesheetApprovalByUser(userId, accountId);
        dispatch(getPendingApprovalTimesheets(responseData));
      };
}



