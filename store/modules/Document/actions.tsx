
import { documentService } from '../../../services';
import { ActionTypes } from './constants';



export const setDocumentsByType = (documents) => {
    return {
        type: ActionTypes.SET_DOCUMENTS_BY_TYPE,
        payload: documents
    }
}

export const getDocumentsByType = (documents) => {
    return {
        type: ActionTypes.GET_DOCUMENTS_BY_TYPE,
        payload: documents
    }
}

export const fetchDocumentsByType = (typeId, type) => {
    return async (dispatch) => {
        const responseData = await documentService.getDocumentsByType(type, typeId);
        dispatch(getDocumentsByType(responseData));
      };
}

export const removeDocumentByIndex = (documentIndex) => {
    return {
        type: ActionTypes.REMOVE_DOCUMENT_BY_INDEX,
        payload: documentIndex
    }
}


export const setDocumentType = (documentType) => {
    return {
        type: ActionTypes.SET_DOCUMENT_TYPE,
        payload: documentType
    }
}
