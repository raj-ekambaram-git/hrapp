import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure,
  Table,
  Thead,
  Th,
  Tr,
  Tbody
} from '@chakra-ui/react'
import { useDispatch, useSelector } from "react-redux";
import {fetchDocumentsByType} from '../../store/modules/Document/actions'
import AddEditDocument from "./addEditDocument";



const ManageDocuments = (props) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');

  const documentType = useSelector(state => state.document.documentType);
  const documents = useSelector(state => state.document.documentsByTpe);
  
  const handleClick = (newSize) => {
    setSize(newSize)
    dispatch(fetchDocumentsByType(documentType.typeId, documentType.type))
    onOpen()
  }
  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("lg")}
              key="lg"
              m={1}
              >{`Documents`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size="xl">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                {documentType.type} Documents
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <AddEditDocument/>
                                <Table>
                                    <Thead>
                                      <Tr>
                                        <Th>
                                        </Th>
                                        <Th>
                                          ID
                                        </Th>
                                        <Th>
                                          Name
                                        </Th>
                                        <Th>
                                          Status
                                        </Th>
                                        <Th>
                                          Created On
                                        </Th>
                                        <Th>
                                          Created By
                                        </Th>
                                        <Th>
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                    {documents?.map((document) => (
                                      <Tr>
                                        <Th>
                                        </Th>
                                        <Th>
                                          {document.id}
                                        </Th>
                                        <Th>
                                          {document.name}
                                        </Th>
                                        <Th>
                                          {document.status}
                                        </Th>
                                        <Th>
                                          {document.createdDate}
                                        </Th>
                                        <Th>
                                            {document.createdUser?.firstName} {document.createdUser?.lastName}
                                        </Th>
                                        <Th>
                                          <Button>View/Download</Button>
                                        </Th>
                                      </Tr>
                                    ))}
                                    </Tbody>                                    
                                  </Table>

                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default ManageDocuments;
