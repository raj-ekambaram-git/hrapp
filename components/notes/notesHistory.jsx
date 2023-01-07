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
    Spacer
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { notesService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { setNotesByType,resetNotesByType } from "../../store/modules/Notes/actions";
import AddEditNote from './addEditNote'
import { util } from "../../helpers/util";



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
                                    
                                        {notesHistory?.map((notes) => (
                                        <Card variant="comment"> 
                                            <CardBody>
                                                {notes.notes}
                                            </CardBody>
                                            <Divider/>
                                            <CardFooter>
                                                {/* By {notes.createdUser.firstName} {notes.createdUser.lastName} on {util.getFormattedDateWithTime(notes.lastUpdateDate)} */}
                                            </CardFooter>                                        
                                        </Card>
                                        ))}
                                    {/* <Accordion>
                                        {notesHistory?.map((notes) => (
                                            <AccordionItem marginBottom="1rem" border="1px" width="100%">
                                                <h2>
                                                    <AccordionButton bgColor="table_tile">
                                                        <Box as="span" flex='1' textAlign='left'>
                                                            <Heading size='xs' textTransform='uppercase'>
                                                                {notes.lastUpdateDate} -- {notes.notes.substring(0,10)}...
                                                            </Heading>
                                                        </Box>
                                                        <AddIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <Notes data={{notes: notes}}></Notes>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>                     */}
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