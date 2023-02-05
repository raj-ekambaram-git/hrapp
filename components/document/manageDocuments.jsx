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
  Tbody,
  Badge,
  useToast
} from '@chakra-ui/react'
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import {fetchDocumentsByType, removeDocumentByIndex} from '../../store/modules/Document/actions'
import AddEditDocument from "./addEditDocument";
import { documentService } from "../../services";
import { DocumentConstants } from "../../constants";



const ManageDocuments = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');

  const documentType = useSelector(state => state.document.documentType);
  const documents = useSelector(state => state.document.documentsByType);
  
  const handleClick = (newSize) => {
    setSize(newSize)
    dispatch(fetchDocumentsByType(documentType.typeId, documentType.type))
    onOpen()
  }

  async function handleViewDocument(viewURLPath) {
    const responseData = await documentService.viewDocument(viewURLPath);
    window.open(responseData);

  }

  async function handleDeleteDocument(documentId, index) {
    const updateDocumentRequest = {
      id: documentId,
      status: DocumentConstants.DOCUMENT_STATUS.Delete
    }
    const responseData = await documentService.updateDocument(updateDocumentRequest)
    if(responseData.error) {
      toast({
          title: 'Update Document.',
          description: 'Error updating document, please try again. Details:'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
    }else {
      toast({
          title: 'Update Document.',
          description: 'Successfully udpated document.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        dispatch(removeDocumentByIndex(index))
    }
  }
  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xl")}
              key="xl"
              m={1}
              >{`Documents`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
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
                                    {documents?.map((document, index) => (
                                      <Tr>
                                        <Th>
                                        <DeleteIcon boxSize={4} onClick={() => handleDeleteDocument(document.id, index)}/> 
                                        </Th>
                                        <Th>
                                          {document.id}
                                        </Th>
                                        <Th>
                                          {document.name}
                                        </Th>
                                        <Th>
                                        <Badge color={`${
                                          document.status === "Active"
                                              ? "paid_status"
                                              : document.status === "Inactive"
                                              ? "pending_status"
                                              : "pending_status"
                                          }`}>{document.status}</Badge>                                          
                                        </Th>
                                        <Th>
                                          {document.createdDate}
                                        </Th>
                                        <Th>
                                            {document.createdUser?.firstName} {document.createdUser?.lastName}
                                        </Th>
                                        <Th>
                                          <Button size="xs" bgColor="header_actions" onClick={() => handleViewDocument(document.urlPath)}>View/Download</Button>
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
