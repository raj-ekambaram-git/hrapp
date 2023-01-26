import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { request } from 'http';
import { util } from '../helpers/util';
import { ProjectStatus } from '@prisma/client';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const projectService = {

    deleteProjectResource,
    createProjectResource,
    getAllTimesheetsByProject,
    getProjectTimesheetsByStatus,
    updateUsedBudget,
    updateProjectResource,
    createProject,
    updateProject,
    getProjectBudgetDetails,
    updateResourceUsedBudget,
    getAllExpensesByProject,
    getProjectExpensesByStatus,
    updateMiscUsedBudget,
    markProjectDelete
    
};

function markProjectDelete(projectId, accountId) {
    return fetchWrapper.put(`${baseUrl}/account/project/`+projectId+"?accountId"+accountId, {
        id: projectId,
        status: ProjectStatus.MarkForDelete
    })
        .then(deletedProject => {
            return deletedProject;
        })  
        .catch(err => {
          console.log("Error deletedProject")
          return {errorMessage: err, error: true};
      });
  }

function updateMiscUsedBudget(projectId, usedMiscBudget) {
    return fetchWrapper.put(`${baseUrl}/account/project/${projectId}`, {
        id: projectId,
        usedMiscBudget: usedMiscBudget
    })
        .then(updatedProject => {
            return updatedProject;
        })  
        .catch(err => {
          console.log("Error Updating Used Budget")
          return {errorMessage: err, error: true};
      });
  }

function updateResourceUsedBudget(projectResourceId,projectResourceUsedBudget) {

    return fetchWrapper.put(`${baseUrl}/account/project/resource/`+projectResourceId, {
        projectResourceData: {
            id: parseInt(projectResourceId),
            usedBudget: projectResourceUsedBudget,    
        }
      }
  )
  .then(projectResource => {
    return projectResource;
  })
  .catch(err => {
    console.log("Error Updating projectResource::"+err)
    return {errorMessage: err, error: true};
   });

}


function getProjectBudgetDetails(projectId, accountId) {
    return fetchWrapper.get(`${baseUrl}/reports/project/`+projectId+'/detail?accountId='+accountId, {})
    .then(projectDetail => {
        return projectDetail;
    })
    .catch(err => {
        console.log("Error getting Project Budget ::"+err)
        return {errorMessage: err, error: true};
       });
}

function updateProject(projectId, formData) {

    return fetchWrapper.put(`${baseUrl}/account/project/`+projectId, {
        id: parseInt(projectId),
        name: formData.name,
        referenceCode: formData.referenceCode,
        description: formData.description,
        type: formData.type,
        invoiceCycle: formData.invoiceCycle,
        addressId: parseInt(formData.addressId),
        vendorId: parseInt(formData.vendorId),
        accountId: parseInt(formData.accountId),
        budget: formData.budget,
        miscBudget: formData.miscBudget,
        paymentTerms: formData.paymentTerms,
        timesheetNotesRequired: formData.timesheetNotesRequired,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        totalHours: parseInt(formData.totalHours),
        averageRate: formData.averageRate,            
        status: formData.status
      }
  )
  .then(project => {
    return project;
  })
  .catch(err => {
    console.log("Error Updating Project::"+err)
    return {errorMessage: err, error: true};
   });
}

function createProject(formData) {
    return fetchWrapper.post(`${baseUrl}/account/project/create`, {
            name: formData.name,
            referenceCode: formData.referenceCode,
            description: formData.description,
            type: formData.type,
            invoiceCycle: formData.invoiceCycle,
            addressId: parseInt(formData.addressId),
            vendorId: parseInt(formData.vendorId),
            accountId: parseInt(formData.accountId),
            budget: formData.budget,
            miscBudget: formData.miscBudget,
            remainingBudgetToAllocate: formData.budget,
            paymentTerms: formData.paymentTerms,
            timesheetNotesRequired: formData.timesheetNotesRequired,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            totalHours: parseInt(formData.totalHours),
            averageRate: util.getDecimalValue(formData.averageRate),            
            status: formData.status
        }
    )
    .then(async project => {
  
        return project;
    })        
    .catch(err => {
      console.log("Error Creating Project"+err)
      return {errorMessage: err, error: true};
    });
  }


function updateProjectResource(requestData, remainingBudgetToUpdate) {

    return fetchWrapper.put(`${baseUrl}/account/project/resource/`+requestData.id, {
        projectResourceData: {
            id: parseInt(requestData.id),
            projectId: parseInt(requestData.projectId),
            userId: parseInt(requestData.userId),
            unitPrice: requestData.unitPrice,
            cost: requestData.cost,
            quantity: parseInt(requestData.quantity),
            fromDate: new Date(requestData.fromDate),
            toDate: new Date(requestData.toDate),
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
            cost: requestData.cost,
            quantity: parseInt(requestData.quantity),
            fromDate: new Date(requestData.fromDate),
            toDate: new Date(requestData.toDate),
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

function getProjectExpensesByStatus(inputParam){
    return fetchWrapper.get(`${baseUrl}/account/project/`+inputParam.projectId+'/expenses/?accountId='+inputParam.accountId+'&status='+inputParam.status, {})
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


function getAllExpensesByProject(inputParam) {
    return fetchWrapper.get(`${baseUrl}/account/project/`+inputParam.projectId+'/expenses?accountId='+inputParam.accountId, {})
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


