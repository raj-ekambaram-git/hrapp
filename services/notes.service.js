import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';
import { NotesConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const notesService = {

    getNotesHistory,
    createNotes,
    createReply
    
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

function createReply(type, typeId, notes, createdBy, notesId) {
    const reply = {
        type: type, typeId: typeId, notes: notes, createdBy: createdBy, mode: NotesConstants.NOTES_MODE.Reply
    }
    return fetchWrapper.post(`${baseUrl}/notes/reply/`+notesId, {id:notesId, replies : {create: [reply]}})
        .then(notes => {
            return notes;
        })        
        .catch(err => {
            console.log("Inside createNotes Error")
            return {errorMessage: err, error: true};
        });
}