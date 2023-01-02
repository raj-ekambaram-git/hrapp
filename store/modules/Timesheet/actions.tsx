import { ActionTypes } from './constants';

export const submitNewTimesheet = (timsheet) => ({

    type: ActionTypes.SUBMIT_NEW_TIMESHEET,
    payload: timsheet
});


export const setUser = (userObj) => {
    console.log("userObj::::"+JSON.stringify(userObj));
    return {
        type: ActionTypes.SUBMIT_NEW_TIMESHEET,
        payload: userObj
    }
}