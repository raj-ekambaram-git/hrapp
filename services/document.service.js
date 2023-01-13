import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { NotesConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const documentService = {

    getUploadURL,
    uploadFile
    
};


function getUploadURL(name, type) {
    return fetchWrapper.post(`${baseUrl}/document/upload`, {
        name: name,
        type: type,
    })
    .then(data => {
        console.log("DATAA:::"+JSON.stringify(data))
        return data;
    });
}

function uploadFile(url, file, type) {
    return fetchWrapper.filePut(url, file, type)
    .then(response => {
        return response;
    });
}

