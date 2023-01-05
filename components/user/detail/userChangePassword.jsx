import React, { useState, useEffect } from "react";
import {util} from '../../../helpers/util';
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
  StackDivider,
  useToast

} from '@chakra-ui/react'
import { userService } from '../../../services';


const UserChangePassword = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  console.log(" Chnage Passsword::"+JSON.stringify(props));

  const {data} = props;
  const toast = useToast()
  

  useEffect(() => {
    setUserId(props.data.id);  
  }, []);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  async function handleChangePassword() {

    if(util.isStrongPassword(newPassword)) {
      console.log("IDDDD ::"+props.data.id)
      const changePasswordResponse = await userService.changePassword(props.data.id, oldPassword, newPassword);
      if(changePasswordResponse != undefined && changePasswordResponse.error) {
        toast({
          title: 'Change Password Erropr.',
          description: changePasswordResponse.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        onClose();
        toast({
          title: 'Change Password.',
          description: 'Password Updated',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })

      }
      
    }else {
      toast({
        title: 'Change Password Error.',
        description: 'Please enter valid passsword.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
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
                          Reset Password
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack divider={<StackDivider />} spacing='1'>
                            <Box border="box_border">
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead>
                                    <Tr>
                                      <Th></Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Old Password
                                        </Th>
                                        <Th>
                                          <Input type="password" width="100%" onChange={(ev) => setOldPassword(ev.target.value)}/>
                                        </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          New Password
                                        </Th>
                                        <Th>
                                          <Input type="password" width="100%" onChange={(ev) => setNewPassword(ev.target.value)}/>
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
