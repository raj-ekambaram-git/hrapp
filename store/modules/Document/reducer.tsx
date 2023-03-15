import { EMPTY_STRING } from "../../../constants/accountConstants";
import { NotesConstants } from "../../../constants";
import { ActionTypes } from "./constants";


const initialState = {
    documentsByType: [],
    documentType: {},
};

const documentReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_DOCUMENTS_BY_TYPE) {
        const newDocumentsByType = [...newState.documentsByType]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.documentsByType = payload;
        }else {
            //Add New Condtion or udpate
            newDocumentsByType.unshift(payload);
            newState.documentsByType = newDocumentsByType;
        }
        
    } else if(type === ActionTypes.GET_DOCUMENTS_BY_TYPE) {
        newState.documentsByType = payload;
    } else if(type === ActionTypes.SET_DOCUMENT_TYPE) {
        newState.documentType = payload;
    } else if(type === ActionTypes.REMOVE_DOCUMENT_BY_INDEX) {
        const newDocumentsByTypeList = [...newState.documentsByType];
        newDocumentsByTypeList.splice(payload, 1);
        newState.documentsByType = newDocumentsByTypeList;

    } 

    return newState;
};

export default documentReducer;