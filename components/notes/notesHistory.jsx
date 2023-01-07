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
import { setNotesByType,resetNotesByType } from "../../store/modules/Notes/actions";
import AddEditNote from './addEditNote'
import {NoteFooter} from './noteFooter';



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
      }, []);

    async function getNotesHistory() {
        const notesHistoryResponse = await notesService.getNotesHistory(notesType?.type, notesType?.typeId);
        console.log("notesHistoryResponse:::"+JSON.stringify(notesHistoryResponse));
        dispatch(setNotesByType(notesHistoryResponse))
    }
    const handleClick = (newSize) => {
        if(notesType?.typeId != undefined && notesType?.typeId != EMPTY_STRING) {
            console.log("Inside the tsEntryDetail")
            getNotesHistory();
            setDisplayNotes(true);  
        }
        setSize(newSize)
        onOpen()
    }

    return (
        <div>
            {(notesType?.type != undefined && notesType?.typeId != undefined) ? (<>
                <Button
                    onClick={() => handleClick("lg")}
                    key="lg"
                    m={1}
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
                                            <CardFooter>
                                                <NoteFooter note={note}/>
                                            </CardFooter>                                        
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