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
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Box,
    useToast,
    Input
  } from '@chakra-ui/react';
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { useDispatch } from "react-redux";
import { EMPTY_STRING } from "../../constants";
import { ErrorMessage } from "../../constants/errorMessage";

    
const ManageConfigurationValues = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [configVal, setConfigVal] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

    function handleLocalConfigValue() {
        if(configVal != undefined && configVal != EMPTY_STRING) {
            props.handleConfigValue(configVal)
            onClose();
            setConfigVal(EMPTY_STRING)
        } else {
            setShowErrorMessage(ErrorMessage.VALUE_REQUIRED)
            return;
        }
    }
    useEffect(() => {
    });

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
                            onClick={onToggle}
                            key="xl"
                            m={1}
                            >{`Add Value`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>Roles</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Box>
                            <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                        </Box>
                        <Table>
                            <Thead>
                                <Th>
                                
                                </Th>
                                <Th bgColor="table_tile">
                                    Value
                                </Th>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Th>
                                    
                                    </Th>
                                    <Th>
                                        <Input type="text" value={configVal} onChange={(ev) => setConfigVal(ev.target.value)}/>                                       
                                    </Th>
                                </Tr>                                                                                         
                            </Tbody>
                        </Table>
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                            <Button variant='outline'  onClick={onClose} >Cancel</Button>
                            <Button colorScheme='red' onClick={handleLocalConfigValue}>Apply</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default ManageConfigurationValues;