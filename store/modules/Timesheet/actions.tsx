import { projectService } from '../../../services';
import { ActionTypes } from './constants';

export const submitNewTimesheet = (timsheet) => ({

    type: ActionTypes.SUBMIT_NEW_TIMESHEET,
    payload: timsheet
});


export const setTSEntries = (timesheetEntries) => {
    console.log("timesheetEntries::::"+JSON.stringify(timesheetEntries));
    return {
        type: ActionTypes.SET_TIMESHEET_ENTRIES,
        payload: timesheetEntries
    }
}

export const getAllProjectTimesheets = (timesheets) => {
    console.log("timesheets::::"+JSON.stringify(timesheets));
    return {
        type: ActionTypes.GET_ALL_PROJECT_TIMESHEETS,
        payload: timesheets
    }
}
export const fetchAllProjectTimesheets = (inputParam) => {
    console.log("setAllProjectTimesheets Data::::::"+JSON.stringify(inputParam));
    return async (dispatch) => {
        const allProjectTimesheets = await projectService.getAllTimesheetsByProject(inputParam);
        console.log("allProjectTimesheets::::"+JSON.stringify(allProjectTimesheets));
        dispatch(getAllProjectTimesheets(allProjectTimesheets));
      };
}

export const fetchProjectTimesheetsByStatus = (inputParam) => {
    console.log("fetchProjectTimesheetsByStatus Data::::::"+JSON.stringify(inputParam));
    return async (dispatch) => {
        const projectTimesheeetByStatus = await projectService.getProjectTimesheetsByStatus(inputParam);
        console.log("allProjectTimesheets::::"+JSON.stringify(projectTimesheeetByStatus));
        dispatch(getAllProjectTimesheets(projectTimesheeetByStatus));
      };
}



