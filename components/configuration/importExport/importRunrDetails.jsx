import React from "react";
import {Button, Box, Popover,PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow,PopoverCloseButton, PopoverBody,PopoverFooter,ButtonGroup , useDisclosure, Text } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";




const ImportRunrDetails = (props) => {
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
                <WarningTwoIcon onClick={onToggle} boxSize={4} color="red"/>
              </Box>
              
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>Import Run Details</PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Text color="red" fontWeight="600">
                  {props.runDetails?props.runDetails:"Import Failed, no error details available"}
                </Text>
                
              </PopoverBody>
              <PopoverFooter display='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                    <Button colorScheme="yellow" size="xs" onClick={onClose} >Cancel</Button>
                  </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
        </Popover>     
  );
};

export default ImportRunrDetails;


