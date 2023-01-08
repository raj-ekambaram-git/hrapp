
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

export const setReplies = (replies) => {
    console.log("setReplies::::ACTIONS:::"+JSON.stringify(replies));
    return {
        type: ActionTypes.SET_REPLIES,
        payload: replies
    }
}

export const getReplies = (replies) => {
    console.log("getReplies::::ACTIONS:::"+JSON.stringify(replies));
    return {
        type: ActionTypes.GET_REPLIES,
        payload: replies
    }
}

export const resetReplies = () => {
    console.log("resetReplies::")
    return {
        type: ActionTypes.RESET_REPLIES,
        payload: []
    }
}


export const setRepliesSelectedNote = (selecteRepliesNote) => {
    console.log("setRepliesSelectedNote::::ACTIONS:::"+JSON.stringify(selecteRepliesNote));
    return {
        type: ActionTypes.SET_REPLIES_SELETED_NOTE,
        payload: selecteRepliesNote
    }
}

export const getRepliesSelectedNote = (selecteRepliesNote) => {
    console.log("getRepliesSelectedNote::::ACTIONS:::"+JSON.stringify(selecteRepliesNote));
    return {
        type: ActionTypes.GET_REPLIES_SELETED_NOTE,
        payload: selecteRepliesNote
    }
}

export const resetRepliesSelectedNote = () => {
    console.log("resetRepliesSelectedNote::")
    return {
        type: ActionTypes.RESET_REPLIES_SELETED_NOTE,
        payload: null
    }
}