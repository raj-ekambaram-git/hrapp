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
    Checkbox
  } from '@chakra-ui/react';
import { ShowInlineErrorMessage } from "../../components/common/showInlineErrorMessage";
import { useDispatch } from "react-redux";
import { UserConstants, USER_ROLES_LOOKUP } from "../../constants";

    
const ManageUserRoles = ({onChange = (e) => {}}) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()

    return (
        <div>
                <Popover
                    returnFocusOnClose={true}
                    isOpen={isOpen}
                    onClose={onClose}
                    placement='bottom-start'
                    closeOnBlur={false}
                    borde
                >
                    <PopoverTrigger>
                        <Button
                            bgColor="button.primary.color"
                            onClick={onToggle}
                            key="xl"
                            m={1}
                            >{`Roles`}
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
                                    Role
                                </Th>
                            </Thead>
                            <Tbody>
                                {USER_ROLES_LOOKUP?.map((userRole) => (
                                    <Tr>
                                        <Th>
                                        <Checkbox
                                            value={userRole.roleID}
                                                  onChange={(e) => onChange(e)}
                                                />   
                                        </Th>
                                        <Th>
                                            {userRole.roleName}
                                        </Th>
                                    </Tr>                                                                                         
                                  ))}                                
                            </Tbody>
                        </Table>
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                            <Button variant='outline'  onClick={onClose} >Cancel</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default ManageUserRoles;