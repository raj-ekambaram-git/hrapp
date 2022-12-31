import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const projectService = {

    deleteProjectResource,
    
};


function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget) {
    return fetchWrapper.delete(`${baseUrl}/account/project/resource/`+projectResourceId+'/delete', {})
        .then(projectResource => {
            console.log("projectResource:::projectResource: UPDATED:"+JSON.stringify(projectResource[0].project))
            //Now call the project project to update the remaining budget
            if(projectResource[0] != undefined && projectResource[0].project != undefined) {
                //`/api/account/project/${projectId}
                const remainingBudgetToAllocate = parseFloat(projectResource[0].project.remainingBudgetToAllocate)+parseFloat(projectResourceAllocatedBudget);
                console.log("Inside the project ID ::"+projectResource[0].project.remainingBudgetToAllocate+ "----ID:::"+projectResource[0].project.id+"---remainingBudgetToAllocate::"+remainingBudgetToAllocate)
                fetchWrapper.put(`${baseUrl}/account/project/`+projectResource[0].project.id, {id:projectResource[0].project.id, remainingBudgetToAllocate: remainingBudgetToAllocate});
            }else {
                
            }
            return projectResource;
        })
        .catch(err => {
            console.log("Error Deleting Project Resource."+err)
            return {errorMessage: err, error: true};
        });
}


