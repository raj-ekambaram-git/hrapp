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
    Divider,
    Heading
  } from '@chakra-ui/react';
  
import { useDispatch } from "react-redux";
import { accountService, documentService, userService } from "../../../services";
import { CommonConstants, EMPTY_STRING } from "../../../constants";
import { InfoIcon } from "@chakra-ui/icons";

const UploadLogo = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [file, setFile] = useState();
    const [logoPath, setLogoPath] = useState(props.logoPath);
    const [uploadingStatus, setUploadingStatus] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const acceptedFileTypes = process.env.ALLOWED_UPLOAD_IMAGE_TYPES
  
    async function handleViewDocument(viewURLPath) {
      const responseData = await documentService.viewDocument(viewURLPath);
      window.open(responseData);
  
    }

    const uploadFile = async () => {
        setUploadingStatus("Uploading the file.");
        const directoryStructure = "account_"+userService.getAccountDetails().accountId+CommonConstants.backSlash;                                      
        const fileURL = await documentService.getUploadURL(directoryStructure+file.name, file.type);
        if(fileURL != undefined && fileURL != EMPTY_STRING) {
            const upload = await documentService.uploadFile(fileURL, file, file.type);
    
            if (upload.ok) {
                setUploadingStatus(" Uploaded.");
                setUploadedFile(file.name);
                const responseData = await accountService.updateLogo(userService.getAccountDetails().accountId,directoryStructure+file.name);
                if(responseData.error) {
                    toast({
                        title: 'New Logo.',
                        description: 'Error adding logo, please try again. Details:'+responseData.errorMessage,
                        status: 'error',
                        position: 'top',
                        duration: 6000,
                        isClosable: true,
                    })
                }else {
                    toast({
                        title: 'New Logo.',
                        description: 'Successfully added new logo.',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                    })
                    setFile(null)
                    setLogoPath(directoryStructure+file.name)
                }
            
            } else {
                console.error('Upload failed.')
            }
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
                <Card>
                    <CardBody>
                          <Heading size="sm" marginBottom={4}>
                              <HStack>
                                <Text>Logo for your account</Text>   
                                <InfoIcon/> 
                                {logoPath?<>
                                  <Button size="xs" bgColor="header_actions" onClick={() => handleViewDocument(logoPath)}>View Logo</Button>
                                </>:<></>}   
                              </HStack>                               
                          </Heading>                                 

                        <HStack>
                            <Text fontSize="14px">Upload Logo </Text>
                            <Input size="xs" accept={acceptedFileTypes} type="file" onChange={(e) => selectFile(e)} width="10%" borderRadius="5px"/>
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
            </Stack>                    
        </>
    );
};

export default UploadLogo;