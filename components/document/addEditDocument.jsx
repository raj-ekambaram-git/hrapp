import React, { useEffect, useState } from "react";

import {
    Button,
    Box,
    Stack,
    HStack,
    useToast,
    Input,
    Text,
    Card,
    CardBody,
    CardFooter,
    Divider,
    FormControl,
    FormLabel,
    Select
  } from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { documentService, userService } from "../../services";
import { CommonConstants, DocumentConstants, EMPTY_STRING } from "../../constants";
import { setDocumentsByType } from "../../store/modules/Document/actions";
import { DocumentType } from "@prisma/client";

const AddEditDocument = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [file, setFile] = useState();
    const [name, setName] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [uploadingStatus, setUploadingStatus] = useState();
    const [accountTemplates, setAccountTemplates] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const documentType = useSelector(state => state.document.documentType);
    const acceptedFileTypes = process.env.ALLOWED_DOCUMENT_TYPES
  
    useEffect(() => {
        getAccountTemplates()
    }, []);

    const getAccountTemplates = async () => {
        const responseData = await documentService.getDocumentsByType(DocumentType.Template, userService.getAccountDetails().accountId);
        setAccountTemplates(responseData)
    }


    const uploadFile = async () => {
        setUploadingStatus("Uploading the file.");
        const directoryStructure = "account_"+userService.getAccountDetails().accountId+CommonConstants.backSlash
                                        +documentType.type+CommonConstants.underScore+documentType.typeId+CommonConstants.backSlash;

        if(name != undefined && name != EMPTY_STRING) {
            const fileURL = await documentService.getUploadURL(directoryStructure+file.name, file.type);
            if(fileURL != undefined && fileURL != EMPTY_STRING) {
                const upload = await documentService.uploadFile(fileURL, file, file.type);
        
                if (upload.ok) {
                    setUploadingStatus(" Uploaded.");
                    setUploadedFile(name);
                    const documentRequest = {
                        name: name,
                        type: documentType.type,
                        typeId: documentType.typeId,
                        urlPath: directoryStructure+file.name,
                        status: DocumentConstants.DOCUMENT_STATUS.Active,
                        createdBy: userService.userValue.id
                    }
                    const responseData = await documentService.createDocument(documentRequest);
                    if(responseData.error) {
                        toast({
                            title: 'New Document.',
                            description: 'Error adding document, please try again. Details:'+responseData.errorMessage,
                            status: 'error',
                            position: 'top',
                            duration: 6000,
                            isClosable: true,
                        })
                    }else {
                        toast({
                            title: 'New Document.',
                            description: 'Successfully added new document.',
                            status: 'success',
                            position: 'top',
                            duration: 3000,
                            isClosable: true,
                        })
                        setName(EMPTY_STRING)
                        setFile(null)
                        setShowErrorMessage(EMPTY_STRING)
                        dispatch(setDocumentsByType(responseData))
                    }
                
                } else {
                    setShowErrorMessage(EMPTY_STRING)
                    console.error('Upload failed.')
                }
            }
        }else {
            setShowErrorMessage("Error happened please try wuth all the fields selected.")
        }
    
    };

    function selectFile(e) {
        setUploadingStatus(EMPTY_STRING)
        setUploadedFile(EMPTY_STRING)
        setFile(e.target.files[0])
    }

    return (
        <>
        <Stack spacing={5} marginBottom={6}>
            <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                <HStack>
                    <Card variant="document">
                        <CardBody>
                            <HStack spacing={7} marginBottom="1rem">
                                <Box fontWeight="500"> Name</Box>
                                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </HStack>
                            <HStack>
                                <Text>Upload </Text>
                                <Input size="xs" accept={acceptedFileTypes} type="file" onChange={(e) => selectFile(e)} width="50%"/>
                            </HStack>
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                        {file && (
                            <HStack>
                                <Box>Selected file: {file.name}</Box>
                                <Button size="xs" colorScheme='red' onClick={uploadFile}>
                                    Upload!
                                </Button>
                            </HStack>
                        )}
                        {uploadingStatus && <Text>{uploadedFile} {uploadingStatus}</Text>}
                        </CardFooter>
                    </Card>
                    <Box>
                        OR
                    </Box>
                    <Card variant="document">
                        <CardBody>
                            <HStack spacing={7} marginBottom="1rem">
                                <Box>
                                <FormControl isRequired>
                                    <FormLabel>Template</FormLabel>
                                    <Select width="100%" id="accountTemplate" >
                                        <option value="">Select a template</option>
                                        {accountTemplates?.map((accountTemplate) => (
                                        <option value={accountTemplate.id}>{accountTemplate.name}</option>
                                        ))}
                                </Select>
                                </FormControl>     
                                </Box>
                            </HStack>

                            <HStack spacing={7} marginBottom="1rem">
                                <Box fontWeight="500"> Name</Box>
                                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </HStack>
                            <HStack>
                            </HStack>
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                        {file && (
                            <HStack>
                                <Box>Selected file: {file.name}</Box>
                                <Button size="xs" colorScheme='red' onClick={uploadFile}>
                                    Upload!
                                </Button>
                            </HStack>
                        )}
                        {uploadingStatus && <Text>{uploadedFile} {uploadingStatus}</Text>}
                        </CardFooter>
                    </Card>                    
                </HStack>                    
            </Stack>                    
        </>
    );
};

export default AddEditDocument;