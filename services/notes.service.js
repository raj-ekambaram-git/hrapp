import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { userService } from './user.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const notesService = {

    getNotesHistory,
    createNotes
    
};


function getNotesHistory(type, typeId) {
    return fetchWrapper.get(`${baseUrl}/notes/${type}/history?typeId=`+typeId, {})
        .then(notesHistory => {
            return notesHistory;
        });
}



function createNotes(type, typeId, notes, createdBy) {
    return fetchWrapper.post(`${baseUrl}/notes/create`, {type: type, typeId: typeId, notes: notes, createdBy: createdBy})
        .then(notes => {
            return notes;
        })        
        .catch(err => {
            console.log("Inside createNotes Error")
            return {errorMessage: err, error: true};
        });
}