import React, { useState, useEffect } from "react";

import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    useDisclosure,
    useToast
  } from '@chakra-ui/react';
import { useDispatch } from "react-redux";

  
const AccountUserSelect = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()

    const handleAccountUserSelect = () => {
        onToggle()
    }

    return (
        <div>
                <Popover
                    returnFocusOnClose={true}
                    isOpen={isOpen}
                    onClose={onClose}
                    placement='bottom-start'
                    closeOnBlur={false}
                >
                    <PopoverTrigger>
                        <Button
                            size="xs"
                            bgColor="header_actions" 
                            onClick={() => handleAccountUserSelect()}
                            key="xl"
                            m={1}
                            >{(props.callType && props.callType === "PaymentTransaction")?"Attach":`Add New`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>New Transaction</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>

                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                        <Button variant='outline' size="xs" onClick={onClose} >Cancel</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default AccountUserSelect;