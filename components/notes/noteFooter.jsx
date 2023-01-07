import React, { useState, useEffect } from "react";

import { util } from "../../helpers/util";
import {
    Box,
   Button,
   CardFooter,
  } from '@chakra-ui/react';
import { useDispatch } from "react-redux";
import { setReplies, resetReplies } from "../../store/modules/Notes/actions";
import NotesReplies from './notesReplies';


function NoteFooter(props) {
    const dispatch = useDispatch();
    const note = props.note;

    async function handleReplySubmit() {
        dispatch(resetReplies())
        dispatch(setReplies(note.replies))
    }

    return (
        <>
            <CardFooter>
                <Box>
                    By&nbsp;<b>{note.createdUser?.firstName} {note.createdUser?.lastName}</b>&nbsp;on&nbsp; <b>{util.getFormattedDateWithTime(note.lastUpdateDate)}</b>&nbsp;
                </Box>
                <Box alignItems="baseline">
                        {note.replies?.length>0 ? (<>
                            <Button aign="right" bgColor="heading" size='xs' onClick={handleReplySubmit}>Replies</Button>
                            
                        </>) : (<></>)}
                </Box>
            </CardFooter>  
            <NotesReplies noteId={note.id}/>
        </>
    );
};

export default NoteFooter;






  