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
import { EMPTY_STRING, UserConstants, USER_ROLES_LOOKUP, USER_ROLES_SUPERADMIN } from "../../constants";
import { userService } from "../../services";

    
const ManageConfigurationValues = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [configVal, setConfigVal] = useState(EMPTY_STRING);

    function handleLocalConfigValue() {
        props.handleConfigValue(configVal)
        onClose();
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
                            >{`Add/Remove Configuration Value`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>Roles</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Box>
                            {/* <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/> */}
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
                                        <Input type="text" onChange={(ev) => setConfigVal(ev.target.value)}/>                                       
                                    </Th>
                                </Tr>                                                                                         
                            </Tbody>
                        </Table>
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                            <Button colorScheme='red' onClick={onClose} >Cancel</Button>
                            <Button colorScheme='red' onClick={handleLocalConfigValue}>Apply</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default ManageConfigurationValues;