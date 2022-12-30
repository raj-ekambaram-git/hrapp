import React, { useState, useEffect } from "react";
import util from '../../../helpers/util';
import {
  useDisclosure,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Heading,
  TableContainer,
  TableCaption,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider

} from '@chakra-ui/react'
import { userService } from '../../../services';


const UserChangePassword = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  console.log(" Chnage Passsword::"+JSON.stringify(props));

  const {data} = props;
  setUserId(props.data.userId);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  function handleChangePassword() {

    if(util.isStrongPassword(newPassword)) {
      userService.changePassword(userId, oldPassword, newPassword);
    }else {
      setErrorMessage("Please enter valid passsword.");
    }
  }

  return (

    <div>
          <Button
              onClick={() => handleClick("md")}
              key="md"
              m={1}
              >{`Change Password`}
          </Button>
          <Drawer onClose={onClose} isOpen={isOpen} size="md">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        
                        <DrawerHeader>
                            <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                                Change Password
                            </Heading>
                            <Heading as="h3" size="md">
                                
                            </Heading>
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack divider={<StackDivider />} spacing='1'>
                            {errorMessage ? (
                              <>
                                <Box border="box_border">
                                  <Text color="heading">
                                    {errorMessage}
                                  </Text>
                                </Box>
                              </>
                            ) : (<>
                            </>)}
                            <Box border="box_border">
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Old Password
                                        </Th>
                                        <Th>
                                          <Input type="password" width="50%" onChange={(ev) => setOldPassword(ev.target.value)}/>
                                        </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          New Password
                                        </Th>
                                        <Th>
                                          <Input type="password" width="50%" onChange={(ev) => setNewPassword(ev.target.value)}/>
                                        </Th>
                                    </Tr>                                    
                                  </Tbody>
                                  
                                </Table>
                              </TableContainer>      
                            </Box>                            

                            <Button className="btn" onClick={() => handleChangePassword()} width="button.primary.width" bgColor="button.primary.color">
                              Change Password
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default UserChangePassword;
