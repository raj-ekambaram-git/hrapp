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
    viewDocument,
    deleteDocument,
    submiteSign,
    getEnvelopeAttachments,
    getEnvelopeDocument,
    
};

function getEnvelopeAttachments(envelopeId, accountId) {
    return fetchWrapper.get(`${baseUrl}/document/esign/envelope/${envelopeId}/attachments?accountId=`+accountId, {})
        .then(documents => {
            return documents;
        });
}

function getEnvelopeDocument(envelopeId, documentId, accountId, docMetaData) {
    return fetchWrapper.post(`${baseUrl}/document/esign/envelope/${envelopeId}/document/${documentId}?accountId=`+accountId, {docMetaData})
        .then(document => {
            return document;
        });
}

function submiteSign(eSignSendRequest) {
    return fetchWrapper.post(`${baseUrl}/document/esign/send`, {
        eSignSendRequest
    }).then(document => {
        console.log("document:::"+JSON.stringify(document))
        return document;
    })      
    .catch(err => {
        console.log("Error Updating Document::"+err)
        return {errorMessage: err, error: true};
    });  
}

function deleteDocument(filePath) {
    return fetchWrapper.post(`${baseUrl}/document/delete`, {filePath})
        .then(document => {
            return document;
        })      
        .catch(err => {
            console.log("Error Updating Document::"+err)
            return {errorMessage: err, error: true};
        });  
}

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
    console.log("URL::"+url+"*****type:::"+type+"****file::"+file)
    return fetchWrapper.filePut(url, file, type)
    .then(response => {
        console.log("REPONSEESS")
        return response;
    });
}

