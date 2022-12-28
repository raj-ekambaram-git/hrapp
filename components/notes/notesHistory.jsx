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
    Tr,
    Th,
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tbody,


  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { notesService } from "../../services";

  const NotesHistory = (props) => {
    const notesType = props.data.notesType;
    const notesTypeId = props.data.notesTypeId;
    const notesTypeTitle = props.data.notesTypeTitle;
    console.log("Notes History Props::"+JSON.stringify(props));
    console.log("notesType:::"+notesType+"--notesTypeId:::"+notesTypeId+"notesTypeTitle::::"+notesTypeTitle);
    // const 
    const [size, setSize] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

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
                                <TableContainer display="flex">
                                    <Table>
                                        <TableCaption></TableCaption>
                                        <Thead>
                                            <Tr bgColor="table_tile">
                                                <Th>
                                                    Notes ID
                                                </Th>
                                                <Th>
                                                    Notes Type
                                                </Th>
                                                <Th>
                                                    Notes
                                                </Th>
                                                <Th>
                                                    Created On
                                                </Th>
                                                <Th>
                                                    Created By
                                                </Th>                            
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {notesHistory?.map((notes) => (
                                                <Tr>
                                                    <Th>
                                                        {notes.id}
                                                    </Th>
                                                    <Th>
                                                        {notes.type}
                                                    </Th>
                                                    <Th>
                                                        {notes.notes}
                                                    </Th>
                                                    <Th>
                                                        {notes.lastUpdateDate}
                                                    </Th>
                                                    <Th>
                                                        {notes.createdBy}
                                                    </Th>                          
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </DrawerBody>
                            </>
                        ) : (<></>)}
                    </DrawerContent>                    

            </Drawer>
        </div>
    );
};


export default NotesHistory;