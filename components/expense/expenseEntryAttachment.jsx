import React, { useState } from "react";
import { useToast, Input, Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup , useDisclosure, HStack } from "@chakra-ui/react";
import {CgAttachment} from 'react-icons/cg';
import Link from "next/link";
import { CommonConstants, EMPTY_STRING } from "../../constants";
import { documentService, expenseService, userService } from "../../services";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { DeleteIcon } from "@chakra-ui/icons";
import { ErrorMessage } from "../../constants/errorMessage";




const ExpenseEntryAttachment = (props) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const toast = useToast();
  // const [file, setFile] = useState();
  const [name, setName] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const acceptedFileTypes = process.env.ALLOWED_DOCUMENT_TYPES


  async function handleViewDocument(viewURLPath) {
    const responseData = await documentService.viewDocument(viewURLPath);
    window.open(responseData);
  }
  

  async function handleDeleteDocument(index) {
    const newAttachments = [...props.attachments]
    newAttachments.splice(index, 1);
    const responseData = await expenseService.addAttachmentToExpenseEntry(props.expenseEntryId,newAttachments)
    if(responseData.error) {
      toast({
          title: 'Delete Attachment.',
          description: 'Error deleting attachment, please try again. Details:'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
      })
    }else {
        toast({
            title: 'Delete Attachment.',
            description: 'Successfully deleted new attachment.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
        })
        props.handleExpenseEntry(props.index, "attachments", newAttachments)
        // onClose()
    }    

  }  


  async function uploadFile(e) {
    if(e) {
      // setFile(e.target.files[0])
      const file = e.target.files[0];

      setUploadingStatus("Uploading the file.");
      const directoryStructure = "account_"+userService.getAccountDetails().accountId+CommonConstants.backSlash
                                      +"Expense"+CommonConstants.underScore+props.expenseId+CommonConstants.backSlash
                                      +"ExpenseEntry"+CommonConstants.underScore+props.expenseEntryId+CommonConstants.backSlash;
  
          const fileURL = await documentService.getUploadURL(directoryStructure+file?.name, file?.type);
          if(fileURL != undefined && fileURL != EMPTY_STRING) {
              const upload = await documentService.uploadFile(fileURL, file, file?.type);
      
              if (upload.ok) {
                  const newAttachments = [...props.attachments]
                  console.log("BEfore Push attachments:::"+JSON.stringify(newAttachments))
                  newAttachments.push(directoryStructure+file.name)
                  console.log("attachments:::"+JSON.stringify(newAttachments))
                  const responseData = await expenseService.addAttachmentToExpenseEntry(props.expenseEntryId,newAttachments)
                  if(responseData.error) {
                    toast({
                        title: 'New Attachment.',
                        description: 'Error adding attachment, please try again. Details:'+responseData.errorMessage,
                        status: 'error',
                        position: 'top',
                        duration: 6000,
                        isClosable: true,
                    })
                  }else {
                      toast({
                          title: 'New Attachment.',
                          description: 'Successfully added new attachment.',
                          status: 'success',
                          position: 'top',
                          duration: 3000,
                          isClosable: true,
                      })
                      setUploadingStatus(" Uploaded.");
                      setUploadedFile(file?.name);
                      // setFile(null)
                      setShowErrorMessage(EMPTY_STRING)
                      props.handleExpenseEntry(props.index, "attachments", newAttachments)
                      // onClose()
                  }


              } else {
                  setShowErrorMessage(EMPTY_STRING)
                  console.error('Upload failed.')
              }
      }else {
        setShowErrorMessage(ErrorMessage.ERROR_UPLOADING)
      }
  }

};

  return (
        <Popover
            returnFocusOnClose={true}
            isOpen={isOpen}
            onClose={onClose}
            closeOnBlur={false}
        >
            <PopoverTrigger>
              <Box>
                 <CgAttachment onClick={onToggle} size={20}/>
              </Box>
              
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Expense Entry Attachment</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                <Input size="xs" accept={acceptedFileTypes} type="file" onChange={(e) => uploadFile(e)} width="50%"  marginBottom="2rem"/>
                {uploadingStatus && <Box fontWeight="bold" marginBottom={2}>{uploadedFile} {uploadingStatus}</Box>}
                {props.attachments?.map((attachment, index) => (
                  <HStack marginBottom={1}>
                    <Box>
                      <DeleteIcon boxSize={3} onClick={() => handleDeleteDocument(index)}/>
                    </Box>
                    <Box>
                      <Link href="" onClick={() => handleViewDocument(attachment)}>  
                        {attachment.split("/")[[attachment.split("/").length-1]]}
                      </Link>
                    </Box>
                  </HStack>
                ))}
              </PopoverBody>
              <PopoverFooter display='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                  </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
        </Popover>     
  );
};

export default ExpenseEntryAttachment;


