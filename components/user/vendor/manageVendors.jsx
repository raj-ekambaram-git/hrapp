import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Table,
  Thead,
  Tbody,
  Box,
  TableContainer,
  TableCaption,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import {fetchUserVendors} from '../../../store/modules/User/actions'
import { userService } from "../../../services";


const ManageVendors = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  // const [userFirstName, setUserFirstName] = useState(EMPTY_STRING);
  // const [userLastName, setUserLastName] = useState(EMPTY_STRING);

  console.log("ManageVendor::"+JSON.stringify(data))

  // const userFirstName = props.userData.userFirstName;
  // const userId = props.userData.userId ;
  const invoiceTransactions = useSelector(state => state.user.userVendors);

  function handleManageVendors(newSize) {
    setSize(newSize);
    onOpen();
    getVendorsForAccount();
  }

  useEffect(() => {
    dispatch(fetchUserVendors(data.userId, userService.getAccountDetails().accountId))
  }, []);

  function getVendorsForAccount() {

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
                          <Stack>
                            <Box border="box_border">
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody> {JSON.stringify(invoiceTransactions)}</Tbody>
                                  
                                </Table>
                              </TableContainer>      
                            </Box>                            

                            <Button className="btn" onClick={() => handleSelectedProjectResource()} width="button.primary.width" bgColor="button.primary.color">
                              Add Project Resource
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default ManageVendors;
