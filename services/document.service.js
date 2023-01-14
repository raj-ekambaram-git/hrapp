import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { NotesConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const documentService = {

    getUploadURL,
    uploadFile,
    createDocument,
    updateDocument,
    getDocumentsByType,
    viewDocument
    
};


function viewDocument(filePath) {
    return fetchWrapper.post(`${baseUrl}/document/view`, {filePath})
        .then(document => {
            return document;
        })      
        .catch(err => {
            console.log("Error Updating Document::"+err)
            return {errorMessage: err, error: true};
        });  
}

function updateDocument(document) {

    return fetchWrapper.put(`${baseUrl}/document/`+document.id, {document}
    )
    .then(document => {
      return document;
    })
    .catch(err => {
      console.log("Error Updating Document::"+err)
      return {errorMessage: err, error: true};
    });
  }

  
function getDocumentsByType(type, typeId) {
    return fetchWrapper.get(`${baseUrl}/document/type/${type}?typeId=`+typeId, {})
        .then(documents => {
            return documents;
        });
}

function createDocument(documentRequest) {
    return fetchWrapper.post(`${baseUrl}/document/create`, {documentRequest})
        .then(document => {
            return document;
        })        
        .catch(err => {
            console.log("Inside createDocument Error")
            return {errorMessage: err, error: true};
        });
}

function getUploadURL(name, type) {
    return fetchWrapper.post(`${baseUrl}/document/upload`, {
        name: name,
        type: type,
    })
    .then(data => {
        return data;
    });
}

function uploadFile(url, file, type) {
    return fetchWrapper.filePut(url, file, type)
    .then(response => {
        return response;
    });
}

