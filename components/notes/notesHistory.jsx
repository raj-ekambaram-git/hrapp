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
    Heading,
    Stack,
    StackDivider,
    Accordion,
    AccordionItem,
    AccordionButton,
    Box,
    AccordionPanel

  } from '@chakra-ui/react';
  import {
    AddIcon
  } from '@chakra-ui/icons';  
import { EMPTY_STRING } from "../../constants/accountConstants";
import { notesService } from "../../services";
import Notes from "../../components/notes/notes";

  const NotesHistory = (props) => {
    const notesType = props.data.notesType;
    const notesTypeId = props.data.notesTypeId;
    const notesTypeTitle = props.data.notesTypeTitle;
    console.log("Notes History Props::"+JSON.stringify(props));
    console.log("notesType:::"+notesType+"--notesTypeId:::"+notesTypeId+"notesTypeTitle::::"+notesTypeTitle);
    // const 
    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [notesHistory, setNotesHistory] = useState([]);
    const [displayNotes, setDisplayNotes] = useState(false);
    

    useEffect(() => {
        console.log("props.notesTypeId:::"+JSON.stringify(notesTypeId));
        if(notesTypeId != undefined && notesTypeId != EMPTY_STRING) {
            console.log("Inside the tsEntryDetail")
            getNotesHistory();
            setDisplayNotes(true);  
        }
    
      }, []);

    async function getNotesHistory() {
        const notesHistoryResponse = await notesService.getNotesHistory(notesType, notesTypeId);
        console.log("notesHistoryResponse:::"+JSON.stringify(notesHistoryResponse));
        setNotesHistory(notesHistoryResponse);
    }
    const handleClick = (newSize) => {
        setSize(newSize)
        onOpen()
    }

    return (
        <div>
            <Button
                onClick={() => handleClick("md")}
                key="md"
                m={1}
                >{`Notes`}
            </Button>

                        
                        
            <Drawer onClose={onClose} isOpen={isOpen} size="md">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        {displayNotes ? (
                            <>
                            <DrawerHeader>
                                <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                                    Notes
                                </Heading>
                                <Heading as="h3" size="md">
                                    for {notesType} {notesTypeTitle}
                                </Heading>
                            </DrawerHeader>
                            <DrawerBody>
                            <Stack divider={<StackDivider />} spacing='1'>
                                <Accordion>
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
                                </Accordion>                    
                            </Stack>
                            </DrawerBody>
                            </>
                        ) : (<></>)}
                    </DrawerContent>                    

            </Drawer>
        </div>
    );
};


export default NotesHistory;