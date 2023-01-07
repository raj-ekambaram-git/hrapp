
import { notesService } from '../../../services';
import { ActionTypes } from './constants';



export const setNotesByType = (notes) => {
    console.log("setNotesByType::::ACTIONS:::"+JSON.stringify(notes));
    return {
        type: ActionTypes.SET_NOTES_BY_TYPE,
        payload: notes
    }
}

export const getNotesByType = (notes) => {
    console.log("getNotesByType::::ACTIONS:::"+JSON.stringify(notes));
    return {
        type: ActionTypes.GET_NOTES_BY_TYPE,
        payload: notes
    }
}

export const resetNotesByType = () => {
    console.log("resetUsersByAccount::")
    return {
        type: ActionTypes.RESET_NOTES_BY_TYPE,
        payload: []
    }
}

export const fetchNotesByType = (typeId, type) => {
    return async (dispatch) => {
        // const responseData = await accountService.getUserList(accountId);
        const responseData = [];
        console.log("fetchUsersByAccount::"+JSON.stringify(responseData))
        dispatch(getNotesByType(responseData));
      };
}



export const setNotesType = (notesType) => {
    console.log("setNotesType::::ACTIONS:::"+JSON.stringify(notesType));
    return {
        type: ActionTypes.SET_NOTES_TYPE,
        payload: notesType
    }
}

export const getNotesType = (notesType) => {
    console.log("getNotesByType::::ACTIONS:::"+JSON.stringify(notesType));
    return {
        type: ActionTypes.GET_NOTES_TYPE,
        payload: notesType
    }
}

export const resetNotesType = () => {
    console.log("resetNotesType::")
    return {
        type: ActionTypes.RESET_NOTES_TYPE,
        payload: {}
    }
}