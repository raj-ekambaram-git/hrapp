import { EMPTY_STRING } from "../../../constants/accountConstants";
import { NotesConstants } from "../../../constants";
import { ActionTypes } from "./constants";


const initialState = {
    notesByTpe: [],
    notesType: {},
    replies: [],
    selecteRepliesNote: null
};

const notesReducer = (state = initialState, {type, payload}) => {

    const newState = {...state};

    if(type === ActionTypes.SET_NOTES_BY_TYPE) {
        const newNotesByType = [...newState.notesByTpe]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.notesByTpe = payload;
        }else {
            //Add New Condtion or udpate
            newNotesByType.unshift(payload);
            newState.notesByTpe = newNotesByType;
        }
        
    } else if(type === ActionTypes.GET_NOTES_BY_TYPE) {
        newState.notesByTpe = payload;
    } else if(type === ActionTypes.RESET_NOTES_BY_TYPE) {
        newState.notesByTpe = [];
    } else if(type === ActionTypes.SET_NOTES_TYPE) {
        newState.notesType = payload;
    } else if(type === ActionTypes.GET_NOTES_BY_TYPE) {
        newState.notesType = payload;
    } else if(type === ActionTypes.RESET_NOTES_TYPE) {
        newState.notesType =  {};
    } else if(type === ActionTypes.SET_REPLIES) {
        const newReplies = [...newState.replies]
        if(Array.isArray(payload)) {
            //Edit Condition
            newState.replies = payload;
        }else {
            //Add New Condtion or udpate
            newReplies.unshift(payload);
            newState.replies = newReplies;
        }
    } else if(type === ActionTypes.GET_REPLIES) {
        newState.replies = payload;
    } else if(type === ActionTypes.RESET_REPLIES) {
        newState.replies =  [];
    } else if(type === ActionTypes.SET_REPLIES_SELETED_NOTE) {
        newState.selecteRepliesNote = payload;
    } else if(type === ActionTypes.GET_REPLIES_SELETED_NOTE) {
        newState.selecteRepliesNote = payload;
    } else if(type === ActionTypes.RESET_REPLIES_SELETED_NOTE) {
        console.log("resettingninignngis")
        newState.selecteRepliesNote =  null;
    } 

    console.log("notesReducer:::New State:::Before Return:::"+JSON.stringify(newState));
    return newState;
};

export default notesReducer;