import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const workFlowService = {

    getTasksByAccount,
    
};

function getTasksByAccount(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/`+accountId+`/workflow/tasks`, {})
    .then(tasks => {
        return tasks;
    })  
    .catch(err => {
        console.log("Error getTasksByAccount"+err)
        return {errorMessage: err, error: true};
    });
}

