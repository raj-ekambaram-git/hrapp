import React, { useEffect, useRef, useState } from "react";
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
    Select,
  } from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { documentService, userService } from "../../services";
import { CommonConstants, ConfigConstants, DocumentConstants, EMPTY_STRING } from "../../constants";
import { setDocumentsByType } from "../../store/modules/Document/actions";
import { DocumentCategory, DocumentType } from "@prisma/client";
import { ESignEmailTos } from "./sign/eSignEmailTos";
import { ESignDetails } from "./sign/eSignDetails";
import {Spinner } from '../../components/';

const AddEditDocument = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [file, setFile] = useState();
    const [name, setName] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [uploadingStatus, setUploadingStatus] = useState();
    const [accountTemplates, setAccountTemplates] = useState();
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [selectedTemplateId, setSelectedTemplateId] = useState();
    const [eSignFeatureEnabled, setESignFeatureEnabled] = useState(false);
    const [documentSignature, setDocumentSignature] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailTo, setEmailTo] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const documentType = useSelector(state => state.document.documentType);
    const acceptedFileTypes = process.env.ALLOWED_DOCUMENT_TYPES

    useEffect(() => {
        getAccountTemplates()
        resetValues()
    }, []);

    const resetValues = () => {
        setUploadingStatus(null)
        setSelectedTemplate(null)
        setName(null)
        setEmailTo(null)
        setShowErrorMessage(EMPTY_STRING)
        setUploadedFile(null)
        setUploadingStatus(null)
    }


    const handleeSignSubmit = async(templatePath) => {
        const esignRequest = {
            esignDetails: emailTo,
            templatePath: selectedTemplate?selectedTemplate:templatePath,
            templateId: selectedTemplateId,
            documentName: name,
            type: documentType.type,
            typeId: documentType.typeId,
            createdBy: userService.userValue.id
        }
        setLoading(true);
        const responseData = await documentService.submiteSign(esignRequest)
        setLoading(false);
        if(responseData.error) {
            setUploadingStatus(null);
            toast({
                title: 'New Document.',
                description: 'Error adding document, please try again. Details:'+responseData.errorMessage,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
            })
            return
        }else {
            toast({
                title: 'New Document.',
                description: 'Successfully added new document and sent for eSignature.',
                status: 'success',
                position: 'top',
                duration: 3000,
                isClosable: true,
            })
            setName(EMPTY_STRING)
            setFile(null)
            setShowErrorMessage(EMPTY_STRING)
            setEmailTo(null)
            setDocumentSignature(false)
            dispatch(setDocumentsByType(responseData))            
        }
    }

    const handleTemplateSelection = (selectedTemplateId) => {
        const inputValue = selectedTemplateId.target.value;
        setSelectedTemplateId(inputValue)
        const selectedTemplatePath = selectedTemplateId.target.options.item(selectedTemplateId.target.selectedIndex).getAttribute("data-templatePath")
        if(selectedTemplatePath) {
            setSelectedTemplate(selectedTemplatePath)
        }

    }

    const getAccountTemplates = async () => {
        const responseData = await documentService.getDocumentsByType(DocumentType.Template, userService.getAccountDetails().accountId);
        setAccountTemplates(responseData)
        setESignFeatureEnabled(userService.accountFeatureEnabled(ConfigConstants.FEATURES.ESIGNATURE))
    }

    const handleDocumentSignature = (documentSignatureSelected) => {
        if(documentSignatureSelected) {
            setDocumentSignature(true)
        }else {
            setDocumentSignature(false)
        }
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
                    if(eSignFeatureEnabled && emailTo) {
                        setSelectedTemplate(directoryStructure+file.name)
                        handleeSignSubmit(directoryStructure+file.name)
                    } else {
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
            {loading? (
                  <>
                  <Spinner/>
                  </>
                ) : (<></>)}
                    <Card variant="document">
                        <CardBody>
                            <Stack spacing={9}>
                                <HStack spacing={12}>
                                    <HStack spacing={7}>
                                        <Box fontWeight="500">Upload </Box>
                                        <Input size="xs" accept={acceptedFileTypes} type="file" onChange={(e) => selectFile(e)} width="50%"/>
                                    </HStack>
                                    {eSignFeatureEnabled?<>
                                        <Box fontSize={12} fontWeight="600">
                                            (OR)
                                        </Box>
                                        <Select id="accountTemplate" width="30%" onChange={(ev) => handleTemplateSelection(ev)}>
                                            <option value="">Select a Template</option>
                                            {accountTemplates?.map((accountTemplate) => (
                                                accountTemplate.category != DocumentCategory.Signature?<option value={accountTemplate.id} data-templatePath={accountTemplate.urlPath} >{accountTemplate.name}</option>:<></>                                    
                                            ))}
                                        </Select>

                                    </>:<></>}
                                </HStack>    
                                <HStack spacing={9} marginBottom="1rem">
                                    <Box fontWeight="500"> Name</Box>
                                    <Input type="text" width="20%" value={name} onChange={(e) => setName(e.target.value)} />
                                </HStack>  
                                {eSignFeatureEnabled?<>
                                    <HStack spacing={9} marginBottom="1rem">
                                        <Box fontWeight="500"> eSignature Required?</Box>
                                        <ESignEmailTos handleDocumentSignature={handleDocumentSignature} setEmailTo={setEmailTo} documentType={documentType}/>                                      
                                    </HStack>  
                                    {emailTo?<>
                                        <ESignDetails emailTo={emailTo} setEmailTo={setEmailTo}/>
                                    </>:<></>}                                     
                                </>:<></>} 
                            </Stack>                                                                          
                        </CardBody>
                        <CardFooter>                        
                        {file && (
                            <HStack>
                                <Box>Selected file: {file.name}</Box>
                                <Button size="xs" colorScheme='red' onClick={uploadFile}>
                                    {(eSignFeatureEnabled && emailTo)?"Upload and send for eSign":"Upload!"}
                                </Button>
                            </HStack>
                        )}
                        {uploadingStatus && <Text>{uploadedFile} {uploadingStatus}</Text>}
                        {(eSignFeatureEnabled && emailTo && selectedTemplate && !loading)?(
                            <HStack>
                                <Button size="xs" colorScheme='red' onClick={handleeSignSubmit}>
                                    Send for eSign
                                </Button>
                            </HStack>
                        ):<></>}                        
                        </CardFooter>
                    </Card>                            
            </Stack>                    
        </>
    );
};

export default AddEditDocument;