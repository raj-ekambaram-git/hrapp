import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const projectService = {

    deleteProjectResource,
    getAllTimesheetsByProject
    
};

/**
 * 
 * @param {*} projectId 
 * @param {*} accountId 
 * @returns 
 */
function getAllTimesheetsByProject(inputParam) {
    console.log("getAllTimesheetsByProject:::"+JSON.stringify(inputParam));
    return fetchWrapper.get(`${baseUrl}/account/project/`+inputParam.projectId+'/timesheets?accountId='+inputParam.accountId, {})
                            .then(timesheets => {
                                    console.log("timesheets:::getAllTimesheetsByProject:::"+JSON.stringify(timesheets))
                                return timesheets
                            })
                            .catch(err => {
                                console.log("Error getting timesheets by project."+err)
                                return {errorMessage: err, error: true};
                            });
}


function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget) {
    return fetchWrapper.delete(`${baseUrl}/account/project/resource/`+projectResourceId+'/delete', {})
        .then(projectResource => {
            console.log("projectResource:::projectResource: UPDATED:"+JSON.stringify(projectResource.project))
            //Now call the project project to update the remaining budget
            if(projectResource != undefined && projectResource.project != undefined) {
                //`/api/account/project/${projectId}
                const remainingBudgetToAllocate = parseFloat(projectResource.project.remainingBudgetToAllocate)+parseFloat(projectResourceAllocatedBudget);
                console.log("Inside the project ID ::"+projectResource.project.remainingBudgetToAllocate+ "----ID:::"+projectResource.project.id+"---remainingBudgetToAllocate::"+remainingBudgetToAllocate)
                const udpateProject = fetchWrapper.put(`${baseUrl}/account/project/`+projectResource.project.id, {id:projectResource.project.id, remainingBudgetToAllocate: remainingBudgetToAllocate});
                return fetchWrapper.get(`${baseUrl}/account/project/`+projectResource.project.id+'/resource', {});
            }
        })
        .catch(err => {
            console.log("Error Deleting Project Resource."+err)
            return {errorMessage: err, error: true};
        });
}


