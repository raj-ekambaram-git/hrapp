import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    useDisclosure,
    DrawerBody,
    Stack,
    StackDivider,
    Box,
    Card,
    CardBody,
    Divider,
  } from '@chakra-ui/react';
  import {TbNote} from 'react-icons/tb';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { notesService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { setNotesType, setNotesByType,resetNotesByType, resetReplies, resetRepliesSelectedNote } from "../../store/modules/Notes/actions";
import AddEditNote from './addEditNote'
import NoteFooter from './noteFooter';
import { NotesType } from "@prisma/client";
import { NotesConstants } from "../../constants";



  const TimesheetEntryNotes = (props) => {
    const dispatch = useDispatch();

    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const [notesHistory, setNotesHistory] = useState([]);
    const [displayNotes, setDisplayNotes] = useState(false);

    const notesType = useSelector(state => state.notes.notesType);
    const notesHistory = useSelector(state => state.notes.notesByTpe);
    

    useEffect(() => {
        dispatch(resetNotesByType());
        dispatch(resetReplies());
        dispatch(resetRepliesSelectedNote())
        setDisplayNotes(true);  
      }, []);

    async function getNotesHistory() {
        const notesHistoryResponse = await notesService.getNotesHistory(notesType?.type, notesType?.typeId);
        dispatch(setNotesByType(notesHistoryResponse))
    }
    const handleClick = (newSize) => {

        const notesData = {
            type: NotesConstants.NOTES_TYPE.TimesheetEntry,
            typeId: parseInt(props.TimesheetEntryId),
            typeName: NotesConstants.NOTES_TYPE.TimesheetEntry
          }

          dispatch(setNotesType(notesData));

        if(notesType?.typeId != undefined && notesType?.typeId != EMPTY_STRING) {
            dispatch(resetReplies());
            dispatch(resetNotesByType());
            dispatch(resetRepliesSelectedNote())
            getNotesHistory();
            setDisplayNotes(true);  
            
        }
        setSize(newSize)
        onOpen()
    }

    return (
        <div>
            {(notesType?.type != undefined && notesType?.typeId != undefined) ? (<>
                <Box>
                 <TbNote size="20px" onClick={() => handleClick("lg")}/>
                </Box>
                <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                    <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            {displayNotes ? (
                                <>
                                <DrawerHeader>
                                        Comments for {notesType?.type} {notesType?.typeName}
                                </DrawerHeader>
                                <DrawerBody>
                                <Stack divider={<StackDivider />} spacing='1'>
                                    <Box>
                                        <AddEditNote popoverTitle="New Comment"/>
                                    </Box>
                                    
                                        {notesHistory?.map((note) => (
                                        <Card variant="comment"> 
                                            <CardBody>
                                                {note.notes}
                                            </CardBody>
                                            <Divider/>
                                            <NoteFooter note={note}/>
                                        </Card>
                                        ))}
                                </Stack>
                                </DrawerBody>
                                </>
                            ) : (<></>)}
                        </DrawerContent>                    
                </Drawer>            
            </>) : (<></>)}
        </div>
    );
};


export default TimesheetEntryNotes;