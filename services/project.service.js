import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const projectService = {

    deleteProjectResource,
    
};


function deleteProjectResource(projectResourceId) {
    return fetchWrapper.delete(`${baseUrl}/account/project/resource/`+projectResourceId+'/delete', {})
        .then(projectResource => {
            return projectResource;
        })
        .catch(err => {
            console.log("Error Deleting Project Resource.")
            return {errorMessage: err, error: true};
        });
}


