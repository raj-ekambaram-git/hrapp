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
import { InfoOutlineIcon } from "@chakra-ui/icons";

  
const TaskTypeDetail = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { isOpen, onToggle, onClose } = useDisclosure()

    const handleTaskTypeDetail = () => {

        onToggle()
    }

    return (
        <div>
                <Popover
                >
                    <PopoverTrigger>
                        <InfoOutlineIcon onClick={() => handleTaskTypeDetail()} />
                        {/* <Button
                            size="xs"
                            bgColor="header_actions" 
                            
                            key="xl"
                            m={1}
                            >{(props.callType && props.callType === "PaymentTransaction")?"Attach":`Add New`}
                        </Button>   */}
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>Task Type Details</PopoverHeader>
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

export default TaskTypeDetail;