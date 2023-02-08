import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const workFlowService = {

    getTasksByAccount,
    createTask,
    updateTask,
    
};


function updateTask(taskRequest, taskId, accountId) {
    return fetchWrapper.put(`${baseUrl}/account/`+accountId+`/workflow/task/`+taskId, {taskRequest})
        .then(task => {
            return task;
        })        
        .catch(err => {
            console.log("Inside updateTask Error")
            return {errorMessage: err, error: true};
        });
}

function createTask(taskRequest, accountId) {
    return fetchWrapper.post(`${baseUrl}/account/`+accountId+`/workflow/task/create`, {taskRequest})
        .then(task => {
            return task;
        })        
        .catch(err => {
            console.log("Inside createTask Error")
            return {errorMessage: err, error: true};
        });
}

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

