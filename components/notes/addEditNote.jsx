import React, { useState } from "react";

import {
    Button,
    Box,
    useDisclosure,
    Textarea,
    Stack
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { useDispatch, useSelector } from "react-redux";
import { notesService, userService } from "../../services";
import { ErrorMessage } from "../../constants/errorMessage";
import { setNotesByType } from "../../store/modules/Notes/actions";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";

const AddEditNote = (props) => {
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [note, setNote] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const popoverTitle = props.popoverTitle;
    const notesType = useSelector(state => state.notes.notesType);

    async function handleNoteSubmit() {
        if(note != undefined && note != EMPTY_STRING) {
            const responseData = await notesService.createNotes(notesType?.type, notesType?.typeId, note, userService.userValue?.id);
            if(!responseData.error) {
                dispatch(setNotesByType(responseData));
            }else {
                setShowErrorMessage(responseData.errorMessage)
            }
            setNote(EMPTY_STRING);
            onClose();
        }else {
            setShowErrorMessage(ErrorMessage.COMMENTS_REQUIRED);
            return;
        }        
    }

    return (
        <>
        <Stack spacing={5} marginBottom={6}>
            <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
            <Box border={1}>
                <Textarea border='1px' value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Add Comment"/>     
            </Box>
            <Box>
                <Button colorScheme='red' onClick={handleNoteSubmit}>Comment</Button>   
            </Box>            
        </Stack>
        </>
    );
};

export default AddEditNote;