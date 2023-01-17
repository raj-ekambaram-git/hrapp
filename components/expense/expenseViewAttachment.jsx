import React from "react";
import {Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup ,Button, useDisclosure } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { documentService } from "../../services";

const ExpenseViewAttachment = (props) => {
  const { isOpen, onToggle, onClose } = useDisclosure()

  async function handleViewDocument(viewURLPath) {
    const responseData = await documentService.viewDocument(viewURLPath);
    window.open(responseData);
  }

  return (
        <Popover
            returnFocusOnClose={true}
            isOpen={isOpen}
            onClose={onClose}
            closeOnBlur={false}
        >
            <PopoverTrigger>
              <Box>
                 <AttachmentIcon onClick={onToggle} boxSize={4}/>
              </Box>
              
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Expense Attachments</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
              {props.attachments?.map((attachment, index) => (
                <Box>
                  <Link href="" onClick={() => handleViewDocument(attachment)}>  
                    {attachment.split("/")[[attachment.split("/").length-1]]}
                  </Link>
                </Box>
              ))}            
              </PopoverBody>
              <PopoverFooter display='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                  <Button variant='outline'  onClick={onClose} >Cancel</Button>
                  </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
        </Popover>     
  );
};

export default ExpenseViewAttachment;


