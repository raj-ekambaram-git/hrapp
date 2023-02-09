import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const workFlowService = {

    getTasksByAccount,
    createTask,
    updateTask,
    getTaskListByType,
    getAssignedToList,
    getWorkFlowData,
    updateStep,
    updateWorkFlow,
    
};

function updateWorkFlow(workFlowRequest, workFlowId, accountId) {
    return fetchWrapper.put(`${baseUrl}/account/`+accountId+`/workflow/`+workFlowId, {workFlowRequest})
        .then(workFlow => {
            return workFlow;
        })        
        .catch(err => {
            console.log("Inside updateWorkFlow Error")
            return {errorMessage: err, error: true};
        });
}

function updateStep(stepRequest, stepId, accountId) {
    return fetchWrapper.put(`${baseUrl}/account/`+accountId+`/workflow/step/`+stepId, {stepRequest})
        .then(step => {
            return step;
        })        
        .catch(err => {
            console.log("Inside updateTask Error")
            return {errorMessage: err, error: true};
        });
}


function getWorkFlowData(type, typeId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/`+accountId+`/workflow/type/`+type+'/detail?typeId='+typeId, {})
    .then(workFlowData => {
        return workFlowData;
    })
    .catch(err => {
        console.log("Error getting getWorkFlowData  ::"+err)
        return {errorMessage: err, error: true};
       });
  }

function getTaskListByType(type, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/`+accountId+`/workflow/type/`+type+'/tasks', {})
    .then(tasks => {
        return tasks;
    })  
    .catch(err => {
        console.log("Error getTaskListByType"+err)
        return {errorMessage: err, error: true};
    });
}

function getAssignedToList(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/`+accountId+`/workflow/admins`, {})
    .then(tasks => {
        return tasks;
    })  
    .catch(err => {
        console.log("Error getAssignedToList"+err)
        return {errorMessage: err, error: true};
    });
}

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

