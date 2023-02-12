import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.schedulerAPIURL}`;

export const schedulerService = {
    scheduleJob,    
    getScheduleJobs
};

function getScheduleJobs(accountId) {
    console.log("accountId:::"+accountId+"****baseUrl:::"+baseUrl)
    return fetchWrapper.get(`${baseUrl}/scheduler/account/`+accountId+`/jobs?accountId=`+accountId, {})
    .then(jobs => {
        console.log("jobs:::"+JSON.stringify(jobs))
        return jobs;
    })  
    .catch(err => {
        console.log("Error getScheduleJobs"+err)
        return {errorMessage: err, error: true};
    });
}

function scheduleJob(scheduleRequest, accountId) {
    return fetchWrapper.post(`${baseUrl}/scheduler/schedule`, {
        scheduleRequest
    })
    .then(schedulers => {
        return schedulers;
    })        
    .catch(err => {
        console.log("Inside scheduleJob Error")
        return {errorMessage: err, error: true};
    });
}
