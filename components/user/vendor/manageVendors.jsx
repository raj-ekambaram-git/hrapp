import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Table,
  Thead,
  Tbody,
  Box,
  TableContainer,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Th,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import {fetchUserVendors, setUserVendors, removeUserVendorByIndex} from '../../../store/modules/User/actions'
import { userService } from "../../../services";
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { ErrorMessage } from "../../../constants/errorMessage";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";



const ManageVendors = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const [userVendorId, setUserVendorId] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

  const userVendors = useSelector(state => state.user.userVendors);
  const vendorListNew = useSelector(state => state.vendor.vendorsByAccount);

  function handleManageVendors(newSize) {
    setSize(newSize);
    onOpen();
  }

  useEffect(() => {
    setShowErrorMessage(EMPTY_STRING);
    dispatch(fetchUserVendors(data.userId, userService.getAccountDetails().accountId))
  }, []);

  async function handleRemoveVendorFromUser(userVenId, removedIndex) {
    const userVendorRequest = {
      id: parseInt(userVenId),
      accountId: userService.getAccountDetails().accountId
    };
    const responseData = await userService.removeUserVendor(userVendorRequest,);
    if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
      toast({
        title: 'Remove Vendor from an user.',
        description: 'Error removing vendor to an user. Details::'+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }else {
      dispatch(removeUserVendorByIndex(removedIndex));
      toast({
        title: 'Remvoe Vendor to an user.',
        description: 'Successfully remove vendor to this user.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }
  }


  async function handleAddVendorToUser() {

    if(userVendorId != undefined && userVendorId != EMPTY_STRING) {
      const userVendorRequest = {
        userId: parseInt(data.userId),
        vendorId: parseInt(userVendorId),
        status: "Active"
      };
      const responseData = await userService.addUserVendor(userVendorRequest, userService.getAccountDetails().accountId);
      if(responseData != undefined && responseData!= EMPTY_STRING && responseData.error) {
        toast({
          title: 'Add Vendor to an user.',
          description: 'Error adding vendor to an user. Details::'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        dispatch(setUserVendors(responseData));
        toast({
          title: 'Add Vendor to an user.',
          description: 'Successfully added vendor to this user.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }
    }else {
      setShowErrorMessage(ErrorMessage.SELECT_VENDOR_REQUIRED);
      return;
    }
  }
  return (

    <div>

          <Button
              onClick={() => handleManageVendors("lg")}
              key="lg"
              m={1}
              >{`Add/Remove Vendor`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Manage Vendors for user {data.userFirstName} {data.userLastName}
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
                                        Vendor
                                      </Th>                                      
                                    </Tr>
                                  </Thead>
                                  <Tbody> 
                                  {userVendors?.map((userVendor, index) => (
                                    <Tr>
                                      <Th>
                                        <DeleteIcon onClick={() => handleRemoveVendorFromUser(userVendor.id, index)}/>
                                      </Th>
                                      <Th>
                                        {userVendor.vendor?.name}
                                      </Th>                                      
                                    </Tr>
                                  ))}                                    
                                  </Tbody>
                                </Table>
                              </TableContainer>      
                            </Box>                            
                            <Box>
                              <Box>
                                <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                            </Box>                          
                            <FormControl isRequired>
                              <FormLabel>Vendor</FormLabel>
                              <Select width="50%" onChange={(ev) => setUserVendorId(ev.target.value)}>
                                  <option value="">Select an Vendor</option>
                                  {vendorListNew?.map((vendor) => (
                                    <option value={vendor.id}>{vendor.name}</option>
                                  ))}
                              </Select>
                            </FormControl>     
                            </Box> 
                            <Button onClick={() => handleAddVendorToUser()} size="sm" width="30%" bgColor="button.primary.color">
                              Add Vendor
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default ManageVendors;
