import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    useDisclosure,
    Button,
    DrawerBody,
    Stack,
    StackDivider,
    Box,
    Card,
    CardBody,
    CardFooter,
    Divider,
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { notesService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { setNotesByType,resetNotesByType, resetReplies, resetRepliesSelectedNote } from "../../store/modules/Notes/actions";
import AddEditNote from './addEditNote'
import NoteFooter from './noteFooter';



  const NotesHistory = (props) => {
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
                <Button size="xs" bg={props.btnColor?props.btnColor:""}
                    onClick={() => handleClick("lg")}
                    >{`Comments`}
                </Button>
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


export default NotesHistory;