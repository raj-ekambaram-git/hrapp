import React, { useState, useEffect } from "react";

import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    Box,
    useDisclosure,
    Textarea,
    Stack
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { useDispatch, useSelector } from "react-redux";
import { notesService, userService } from "../../services";
import { ErrorMessage } from "../../constants/errorMessage";
import { ShowInlineErrorMessage } from "../../components/common/showInlineErrorMessage";
import { setNotesByType } from "../../store/modules/Notes/actions";


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
            <Box border={1}>
                <Textarea border='1px' value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Add Comment"/>     
            </Box>
            <Box>
                <Button colorScheme='red' onClick={handleNoteSubmit}>Comment</Button>   
            </Box>
            
        </Stack>

        </>
    //     <Popover
    //     returnFocusOnClose={true}
    //     isOpen={isOpen}
    //     onClose={onClose}
    //     placement='bottom-start'
    //     closeOnBlur={false}
    // >
    //     <PopoverTrigger>
    //         <Button
    //             bgColor="button.primary.color"
    //             onClick={onToggle}
    //             key="xl"
    //             m={1}
    //             >{popoverTitle}
    //         </Button>  
    //     </PopoverTrigger>
    //     <PopoverContent>
    //     <PopoverHeader>{popoverTitle}</PopoverHeader>
    //     <PopoverArrow />
    //     <PopoverCloseButton />
    //     <PopoverBody>
    //         <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
    //         <Box>
    //             <Textarea value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Add Comment"/>
    //         </Box>
    //     </PopoverBody>
    //     <PopoverFooter display='flex' justifyContent='flex-end'>
    //         <ButtonGroup size='sm'>
    //         <Button variant='outline'  onClick={onClose} >Cancel</Button>
    //         <Button colorScheme='red' onClick={handleNoteSubmit}>Apply</Button>
    //         </ButtonGroup>
    //     </PopoverFooter>
    //     </PopoverContent>
    // </Popover>    
    );
};

export default AddEditNote;