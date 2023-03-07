import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useDisclosure,
  Box,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Badge,
  FormControl,
  FormLabel,
  Select,
  Text,
  useToast
} from '@chakra-ui/react'
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useSelector, useDispatch } from "react-redux";
import { EMPTY_STRING } from "../../constants/accountConstants";
import { ErrorMessage } from "../../constants/errorMessage";
import { fetchUsersByAccount } from "../../store/modules/Account/actions";
import { setVendorUsers, removeUserFromVendorByIndex } from "../../store/modules/Vendor/actions";
import { userService } from "../../services";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";



const VendorUserAddSection = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');
  const [vendorUserId, setVendorUserId] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
  const {data} = props;

  const vendorUsers = useSelector(state => state.vendor.vendorUsers);
  const userListNew = useSelector(state => state.account.accountUsers);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  useEffect(() => {
    setShowErrorMessage(EMPTY_STRING);
    dispatch(fetchUsersByAccount(userService.getAccountDetails().accountId));
  }, []);

  async function handleRemoveUserFromVendor(userVenId, removedIndex) {

    const userVendorRequest = {
      id: parseInt(userVenId),
      accountId: userService.getAccountDetails().accountId
    };
    const responseData = await userService.removeUserVendor(userVendorRequest,);
    if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
      toast({
        title: 'Remove User from client.',
        description: 'Error removing user to client. Details::'+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }else {
      dispatch(removeUserFromVendorByIndex(removedIndex));
      toast({
        title: 'Remvoe User from client.',
        description: 'Successfully removed user from client.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }    

  }
  async function handleAddVendorToUser() {
    if(vendorUserId != undefined && vendorUserId != EMPTY_STRING) {
      const userVendorRequest = {
        userId: parseInt(vendorUserId),
        vendorId: parseInt(data.vendorId),
        status: "Active"
      };
      const responseData = await userService.addUserVendor(userVendorRequest, userService.getAccountDetails().accountId);
      if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
        toast({
          title: 'Add User to client.',
          description: 'Error adding user to client. Details::'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        dispatch(setVendorUsers(responseData));
        toast({
          title: 'Add User to client.',
          description: 'Successfully added user to this client.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }

    }else {
      setShowErrorMessage(ErrorMessage.SELECT_USER_REQUIRED);
      return;

    }
  }

  return (

    <div>
          <Button size="xs"
              color="black"
              onClick={() => handleClick("xl")}
              key="xl"
              m={1}
              >{`Add User`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Manage Users for client {data.vendorName}
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack spacing={8}>
                                <Box border="box_border">
                                  <TableContainer>
                                    <Table variant="manageUserVendors">
                                      <Thead>
                                          <Tr bgColor="table_tile">
                                            <Th>
                                            </Th>
                                            <Th>
                                              ID
                                            </Th>                                      
                                            <Th>
                                              First Name
                                            </Th>                                      
                                            <Th>
                                              Last Name
                                            </Th>                                      
                                            <Th>
                                              Email
                                            </Th>                                      
                                            <Th>
                                              Phone
                                            </Th>                                      
                                            <Th>
                                              Role
                                            </Th>                                      
                                            <Th>
                                              Status
                                            </Th>     
                                          </Tr>
                                      </Thead>
                                      <Tbody> 
                                        {vendorUsers?.map((vendorUser, index) => (
                                          <Tr>
                                            <Th>
                                              <DeleteIcon color="red" onClick={() => handleRemoveUserFromVendor(vendorUser.id, index)}/>
                                            </Th>
                                            <Th>
                                              {vendorUser.user?.id}
                                            </Th>                                      
                                            <Th>
                                              {vendorUser.user?.firstName}
                                            </Th>                                      
                                            <Th>
                                              {vendorUser.user?.lastName}
                                            </Th>                                      
                                            <Th>
                                              {vendorUser.user?.email}
                                            </Th>                                      
                                            <Th>
                                              {vendorUser.user?.phone}
                                            </Th>   
                                            <Th>
                                              {vendorUser.user?.userRole.map((userRole) => <p>{userRole.role}</p>)}
                                            </Th>                                   
                                            <Th>
                                              <Badge color={`${
                                                  vendorUser.user?.status === "Active"
                                                    ? "paid_status"
                                                    : vendorUser.user?.status === "Inactive"
                                                    ? "pending_status"
                                                    : "pending_status"
                                                }`}>{vendorUser.user?.status}
                                            </Badge>  
                                            </Th>     
                                          </Tr>      
                                        ))}                                                  
                                      </Tbody>
                                    </Table>
                                  </TableContainer>
                                </Box>
                                <Box>
                                  <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                                </Box>                                    
                                <Box>
                                <FormControl isRequired>
                                  <FormLabel>Users</FormLabel>
                                  <Select width="50%" onChange={(ev) => setVendorUserId(ev.target.value)}>
                                      <option value="">Select User</option>
                                      {userListNew?.map((user) => (
                                        <option value={user.id}>{user.firstName} {user.lastName} -- {user.email}</option>
                                      ))}
                                </Select>
                                </FormControl>     
                              </Box> 
                              <Button onClick={() => handleAddVendorToUser()} size="xs" width="20%" bgColor="header_actions">
                                Add Client
                              </Button>                                   
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default VendorUserAddSection;
