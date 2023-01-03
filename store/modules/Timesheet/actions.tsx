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