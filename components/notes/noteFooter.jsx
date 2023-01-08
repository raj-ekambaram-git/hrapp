import React, { useState, useEffect } from "react";

import { util } from "../../helpers/util";
import {
    Box,
    Text,
   CardFooter,
   Button,
   HStack,
  } from '@chakra-ui/react';
import { useDispatch } from "react-redux";
import { setReplies, resetReplies, setRepliesSelectedNote, resetRepliesSelectedNote } from "../../store/modules/Notes/actions";
import NotesReplies from './notesReplies';


function NoteFooter(props) {
    const dispatch = useDispatch();
    const note = props.note;

    async function handleReplySubmit() {
        dispatch(resetReplies())
        dispatch(resetRepliesSelectedNote())
        dispatch(setReplies(note.replies))
        dispatch(setRepliesSelectedNote(note.id))
    }

    return (
        <>
            <CardFooter>
                <HStack spacing='9rem'>
                    <Box>
                        By&nbsp;<b>{note.createdUser?.firstName} {note.createdUser?.lastName}</b>&nbsp;on&nbsp; <b>{util.getFormattedDateWithTime(note.lastUpdateDate)}</b>&nbsp;
                    </Box>
                    <Box>
                            {note.replies?.length>0 ? (<>
                                <Button bgColor="heading" size='xs' onClick={handleReplySubmit}><Text fontSize='15px'>Replies</Text></Button>
                            </>) : (<></>)}
                    </Box>
                </HStack>
            </CardFooter>  
            <NotesReplies noteId={note.id}/>
            
        </>
    );
};

export default NoteFooter;






  