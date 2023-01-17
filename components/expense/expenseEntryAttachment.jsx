import React from "react";
import {Textarea, Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup ,Button, useDisclosure } from "@chakra-ui/react";
import {CgAttachment} from 'react-icons/cg';


const ExpenseEntryAttachment = (props) => {
  const { isOpen, onToggle, onClose } = useDisclosure()


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
                <Textarea type="text" id="tranNotes"  value={props.notes} onChange={(ev) => props.handleExpenseEntry(props.rowIndex, "notes", ev.target.value)} />
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


