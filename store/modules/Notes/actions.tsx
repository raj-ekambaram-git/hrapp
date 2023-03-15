
import { notesService } from '../../../services';
import { ActionTypes } from './constants';



export const setNotesByType = (notes) => {
    return {
        type: ActionTypes.SET_NOTES_BY_TYPE,
        payload: notes
    }
}

export const getNotesByType = (notes) => {
    return {
        type: ActionTypes.GET_NOTES_BY_TYPE,
        payload: notes
    }
}

export const resetNotesByType = () => {
    return {
        type: ActionTypes.RESET_NOTES_BY_TYPE,
        payload: []
    }
}

export const fetchNotesByType = (typeId, type) => {
    return async (dispatch) => {
        // const responseData = await accountService.getUserList(accountId);
        const responseData = [];
        dispatch(getNotesByType(responseData));
      };
}



export const setNotesType = (notesType) => {
    return {
        type: ActionTypes.SET_NOTES_TYPE,
        payload: notesType
    }
}

export const getNotesType = (notesType) => {
    return {
        type: ActionTypes.GET_NOTES_TYPE,
        payload: notesType
    }
}

export const resetNotesType = () => {
    return {
        type: ActionTypes.RESET_NOTES_TYPE,
        payload: {}
    }
}

export const setReplies = (replies) => {
    return {
        type: ActionTypes.SET_REPLIES,
        payload: replies
    }
}

export const getReplies = (replies) => {
    return {
        type: ActionTypes.GET_REPLIES,
        payload: replies
    }
}

export const resetReplies = () => {
    return {
        type: ActionTypes.RESET_REPLIES,
        payload: []
    }
}


export const setRepliesSelectedNote = (selecteRepliesNote) => {
    return {
        type: ActionTypes.SET_REPLIES_SELETED_NOTE,
        payload: selecteRepliesNote
    }
}

export const getRepliesSelectedNote = (selecteRepliesNote) => {
    return {
        type: ActionTypes.GET_REPLIES_SELETED_NOTE,
        payload: selecteRepliesNote
    }
}

export const resetRepliesSelectedNote = () => {
    return {
        type: ActionTypes.RESET_REPLIES_SELETED_NOTE,
        payload: null
    }
}