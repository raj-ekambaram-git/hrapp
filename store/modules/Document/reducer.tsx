import { EMPTY_STRING } from "../../../constants/accountConstants";
import { NotesConstants } from "../../../constants";
import { ActionTypes } from "./constants";


const initialState = {
    documentsByTpe: [],
    documentType: {},
};

const documentReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_DOCUMENTS_BY_TYPE) {
        const newDocumentsByType = [...newState.documentsByTpe]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.documentsByTpe = payload;
        }else {
            //Add New Condtion or udpate
            newDocumentsByType.unshift(payload);
            newState.documentsByTpe = newDocumentsByType;
        }
        
    } else if(type === ActionTypes.GET_DOCUMENTS_BY_TYPE) {
        newState.documentsByTpe = payload;
    } else if(type === ActionTypes.SET_DOCUMENT_TYPE) {
        newState.documentType = payload;
    }

    console.log("notesReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default documentReducer;