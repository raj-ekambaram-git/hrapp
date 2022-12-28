import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const notesService = {

    getNotesHistory,
    
};


function getNotesHistory(type, typeId) {
    return fetchWrapper.get(`${baseUrl}/notes/${type}/history?typeId=`+typeId, {})
        .then(notesHistory => {
            return notesHistory;
        });
}


