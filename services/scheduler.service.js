import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.schedulerAPIURL}`;

export const schedulerService = {
    scheduleJob,    
};

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
