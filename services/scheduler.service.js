import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING, ScheduleJobConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.schedulerAPIURL}`;

export const schedulerService = {
    scheduleJob,    
    getScheduleJobs,
    updateStatus,
    checkUserWeeklyTimesheetReminder,
    checkUInvoiceDueReminder
};

function checkUInvoiceDueReminder(userId, accountId) {
    console.log("accountId:::"+accountId+"****userId:::"+userId)
    return fetchWrapper.get(`${baseUrl}/scheduler/account/`+accountId+`/jobs?jobGroup=`+accountId+ScheduleJobConstants.JOB_GROUP_SUFFIX.INVOICE_DUE_REMINDER, {})
    .then(jobs => {
        return jobs;
    })  
    .catch(err => {
        console.log("Error getScheduleJobs"+err)
        return {errorMessage: err, error: true};
    });
}

function checkUserWeeklyTimesheetReminder(userId, accountId) {
    console.log("accountId:::"+accountId+"****userId:::"+userId)
    return fetchWrapper.get(`${baseUrl}/scheduler/account/`+accountId+`/jobs?jobGroup=`+userId+"_"+accountId+ScheduleJobConstants.JOB_GROUP_SUFFIX.REMINDER, {})
    .then(jobs => {
        return jobs;
    })  
    .catch(err => {
        console.log("Error getScheduleJobs"+err)
        return {errorMessage: err, error: true};
    });
}

function updateStatus(toStatus, jobName, jobGroup, userId, accountId) {
    console.log("accountId:::"+accountId+"****baseUrl:::"+jobName+"****jobGroup:::"+jobGroup+"*****toStatus::"+toStatus)
    
    const requestData = {
        accountId: accountId,
        userId: userId,
        jobGroup: jobGroup,
        jobName: jobName,
        jobAction: toStatus
    }

    let statusPath = EMPTY_STRING;

    if(toStatus === ScheduleJobConstants.JOB_STATUS.Pause) {
        statusPath = "pause"
    } else if (toStatus === ScheduleJobConstants.JOB_STATUS.Resume) {
        statusPath = "resume"
    } else if (toStatus === ScheduleJobConstants.JOB_STATUS.Cancel) {
        statusPath = "unschedule"
    } else if (toStatus === ScheduleJobConstants.JOB_STATUS.Delete) {
        statusPath = "delete"
    }

    return fetchWrapper.post(`${baseUrl}/scheduler/`+statusPath, requestData)
    .then(updatedJob => {
        return updatedJob;
    })  
    .catch(err => {
        console.log("Error getScheduleJobs"+err)
        return {errorMessage: err, error: true};
    });

}

function getScheduleJobs(accountId) {
    console.log("accountId:::"+accountId+"****baseUrl:::"+baseUrl)
    return fetchWrapper.get(`${baseUrl}/scheduler/account/`+accountId+`/jobs?jobGroup=`+accountId, {})
    .then(jobs => {
        return jobs;
    })  
    .catch(err => {
        console.log("Error getScheduleJobs"+err)
        return {errorMessage: err, error: true};
    });
}

function scheduleJob(scheduleRequest, accountId) {
    return fetchWrapper.post(`${baseUrl}/scheduler/schedule`, scheduleRequest)
    .then(schedulers => {
        return schedulers;
    })        
    .catch(err => {
        console.log("Inside scheduleJob Error::"+err)
        return {errorMessage: err, error: true};
    });
}
