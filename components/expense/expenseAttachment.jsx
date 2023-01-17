import React from "react";
import {Textarea, Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup ,Button, useDisclosure } from "@chakra-ui/react";
import {TbNote} from 'react-icons/tb';
import { AttachmentIcon } from "@chakra-ui/icons";

const ExpenseAttachment = (props) => {
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
                 <AttachmentIcon onClick={onToggle} boxSize={5}/>
              </Box>
              
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>NOtes</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Textarea type="text" id="tranNotes"  value={props.notes} onChange={(ev) => props.handleExpenseEntry(props.rowIndex, "notes", ev.target.value)} />
              </PopoverBody>
              <PopoverFooter display='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                  <Button variant='outline'  onClick={onClose} >Cancel</Button>
                  <Button colorScheme='red' onClick={onClose}>Apply</Button>
                  </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
        </Popover>     
  );
};

export default ExpenseAttachment;


