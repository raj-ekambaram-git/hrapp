import React from "react";
import {Textarea, Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup ,Button, useDisclosure } from "@chakra-ui/react";
import {TbNote} from 'react-icons/tb';

const ExpenseViewNotes = (props) => {
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
                 <TbNote onClick={onToggle} size={20}/>
              </Box>
              
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Notes</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Box>
                  {props.notes}
                </Box>
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

export default ExpenseViewNotes;


