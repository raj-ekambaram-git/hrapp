import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const projectService = {

    deleteProjectResource,
    createProjectResource,
    getAllTimesheetsByProject,
    getProjectTimesheetsByStatus,
    updateUsedBudget,
    updateProjectResource,
    
    
};

function updateProjectResource(requestData, remainingBudgetToUpdate) {

    return fetchWrapper.put(`${baseUrl}/account/project/resource/`+requestData.id, {
        projectResourceData: {
            id: parseInt(requestData.id),
            projectId: parseInt(requestData.projectId),
            userId: parseInt(requestData.userId),
            unitPrice: requestData.unitPrice,
            quantity: parseInt(requestData.quantity),
            budgetAllocated: requestData.budgetAllocated,
            currency: requestData.currency,
            billable: requestData.billable,
            isTimesheetApprover: requestData.isTimesheetApprover,
            uom: requestData.uom
          },
          projetUpdateData: {
            projectId: parseInt(requestData.projectId),
            remainingBudgetToAllocate: remainingBudgetToUpdate
          }
    })
        .then(updatedProject => {
            return updatedProject;
        })  
        .catch(err => {
          console.log("Error Updating Used Budget")
          return {errorMessage: err, error: true};
      });
  }

function createProjectResource(requestData, remainingBudgetToUpdate) {

    return fetchWrapper.post(`${baseUrl}/account/project/resource/create`, {
        projectResourceData: {
            projectId: parseInt(requestData.projectId),
            userId: parseInt(requestData.userId),
            unitPrice: requestData.unitPrice,
            quantity: parseInt(requestData.quantity),
            budgetAllocated: requestData.budgetAllocated,
            currency: requestData.currency,
            billable: requestData.billable,
            isTimesheetApprover: requestData.isTimesheetApprover,
            uom: requestData.uom
          },
          projetUpdateData: {
            projectId: parseInt(requestData.projectId),
            remainingBudgetToAllocate: remainingBudgetToUpdate
          }
    })
        .then(updatedProject => {
            return updatedProject;
        })  
        .catch(err => {
          console.log("Error Updating Used Budget")
          return {errorMessage: err, error: true};
      });
  }


function updateUsedBudget(projectId, usedBudget) {
    return fetchWrapper.put(`${baseUrl}/account/project/${projectId}`, {
        id: projectId,
        usedBudget: usedBudget
    })
        .then(updatedProject => {
            return updatedProject;
        })  
        .catch(err => {
          console.log("Error Updating Used Budget")
          return {errorMessage: err, error: true};
      });
  }

function getProjectTimesheetsByStatus(inputParam){
    return fetchWrapper.get(`${baseUrl}/account/project/`+inputParam.projectId+'/timesheets/?accountId='+inputParam.accountId+'&status='+inputParam.status, {})
                            .then(timesheets => {
                                return timesheets
                            })
                            .catch(err => {
                                console.log("Error getting timesheets by project."+err)
                                return {errorMessage: err, error: true};
                            });

}

/**
 * 
 * @param {*} projectId 
 * @param {*} accountId 
 * @returns 
 */
function getAllTimesheetsByProject(inputParam) {
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


function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget, billable) {
    return fetchWrapper.delete(`${baseUrl}/account/project/resource/`+projectResourceId+'/delete', {})
        .then(projectResource => {
            //Now call the project project to update the remaining budget
            if(projectResource != undefined && projectResource.project != undefined) {
                //`/api/account/project/${projectId}
                if(billable) {
                    const remainingBudgetToAllocate = parseFloat(projectResource.project.remainingBudgetToAllocate)+parseFloat(projectResourceAllocatedBudget);
                    console.log("Inside the project ID ::"+projectResource.project.remainingBudgetToAllocate+ "----ID:::"+projectResource.project.id+"---remainingBudgetToAllocate::"+remainingBudgetToAllocate)
                    const udpateProject = fetchWrapper.put(`${baseUrl}/account/project/`+projectResource.project.id, {id:projectResource.project.id, remainingBudgetToAllocate: remainingBudgetToAllocate});
                    // return fetchWrapper.get(`${baseUrl}/account/project/`+projectResource.project.id+'/resource', {});
                    
                    return {remaininBudgetToUpdate: remainingBudgetToAllocate, error: false};
                }else {
                    return projectResource;
                }
            }
        })
        .catch(err => {
            console.log("Error Deleting Project Resource."+err)
            return {errorMessage: err, error: true};
        });
}


