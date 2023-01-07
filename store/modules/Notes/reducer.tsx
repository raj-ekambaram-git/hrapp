import { EMPTY_STRING } from "../../../constants/accountConstants";
import { ActionTypes } from "./constants";

const initialState = {
    notesByTpe: [],
    notesType: EMPTY_STRING
};

const accountReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_NOTES_BY_TYPE) {
        console.log("SET_NOTES_BY_TYPE INSIDE::"+JSON.stringify(payload));
        console.log("newState:::"+JSON.stringify(newState));
        const newNotesByType = [...newState.notesByTpe]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.notesByTpe = payload;
        }else {
            //Add New Condtion or udpate
            newNotesByType.push(payload);
            newState.notesByTpe = newNotesByType;
        }
        
    } else if(type === ActionTypes.GET_NOTES_BY_TYPE) {
        newState.notesByTpe = payload;
    } else if(type === ActionTypes.RESET_NOTES_BY_TYPE) {
        newState.notesByTpe = [];
    }else if(type === ActionTypes.SET_NOTES_TYPE) {
        newState.notesType = payload;
    } else if(type === ActionTypes.GET_NOTES_BY_TYPE) {
        newState.notesType = payload;
    } else if(type === ActionTypes.RESET_NOTES_BY_TYPE) {
        newState.notesType = EMPTY_STRING;
    } 

    console.log("accountReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default accountReducer;