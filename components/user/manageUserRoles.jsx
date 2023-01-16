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
import { UserConstants, USER_ROLES_LOOKUP, USER_ROLES_SUPERADMIN } from "../../constants";
import { userService } from "../../services";

    
const ManageUserRoles = ({selectedUserRoles, onChange = (e) => {}}) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [userRoleLookup, setUserRoleLookup] = useState(USER_ROLES_LOOKUP);

    useEffect(() => {
        if(userService.isSuperAdmin()) {
            setUserRoleLookup(USER_ROLES_SUPERADMIN);
        }
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
                            bgColor="button.primary.color"
                            onClick={onToggle}
                            key="xl"
                            m={1}
                            >{`Add/Remove Roles`}
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
                                {userRoleLookup?.map((userRole) => (
                                    <Tr>
                                        <Th>
                                        <Checkbox
                                            isChecked={selectedUserRoles.includes(userRole.roleID)?true: false}
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