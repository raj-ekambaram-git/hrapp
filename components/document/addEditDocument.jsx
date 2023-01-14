import React, { useState } from "react";

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
    Divider
  } from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { documentService, userService } from "../../services";
import { CommonConstants, EMPTY_STRING } from "../../constants";
import { setDocumentsByType } from "../../store/modules/Document/actions";

const AddEditDocument = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [file, setFile] = useState();
    const [name, setName] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [uploadingStatus, setUploadingStatus] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const documentType = useSelector(state => state.document.documentType);
  
    const uploadFile = async () => {
        setUploadingStatus("Uploading the file.");
        const directoryStructure = "account_"+userService.getAccountDetails().accountId+CommonConstants.backSlash
                                        +documentType.type+CommonConstants.underScore+documentType.typeId+CommonConstants.backSlash;

        const fileURL = await documentService.getUploadURL(directoryStructure+file.name, file.type);
    
        const upload = await documentService.uploadFile(fileURL, file, file.type);
    
        if (upload.ok) {
          setUploadingStatus(" Uploaded.");
          setUploadedFile(name);
          if(name != undefined && name != EMPTY_STRING && fileURL != undefined && fileURL != EMPTY_STRING) {
            const documentRequest = {
                name: name,
                type: documentType.type,
                typeId: documentType.typeId,
                urlPath: fileURL,
                status: "Active",
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
                  dispatch(setDocumentsByType(responseData))
              }
          }else {
            setShowErrorMessage("Error happened please try wuth all the fields selected.")
          }
        } else {
          console.error('Upload failed.')
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
                <Card variant="document">
                    <CardBody>
                        <HStack spacing={7} marginBottom="1rem">
                            <Box fontWeight="500"> Name</Box>
                            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </HStack>
                        <HStack>
                            <Box>Upload </Box>
                            <Input size="xs" type="file" onChange={(e) => selectFile(e)} />
                        </HStack>
                    </CardBody>
                    <Divider/>
                    <CardFooter>
                    {file && (
                        <HStack>
                            <Box>Selected file: {file.name}</Box>
                            <Button size="xs" colorScheme='red'
                                onClick={uploadFile}
                            >
                                Upload!
                            </Button>
                        </HStack>
                    )}
                    {uploadingStatus && <Text>{uploadedFile} {uploadingStatus}</Text>}
                    </CardFooter>
                </Card>
            </Stack>                    
        </>
    );
};

export default AddEditDocument;