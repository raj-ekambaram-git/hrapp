import React, { useState, useEffect } from "react";
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
  useToast,
  Text

} from '@chakra-ui/react'
import { userService } from '../../services';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { util } from "../../helpers";


const UserResetPassword = (props) => {
  const [size, setSize] = useState('');
  const [email, setEmail] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const toast = useToast()
  

  useEffect(() => {
  }, []);

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }

  async function handleResetPassword() {
    if(email != undefined && email != EMPTY_STRING && util.isValidEmail(email)) {
      const resetPasswordResponse = await userService.resetPassword(email.toLowerCase());
      if(resetPasswordResponse != undefined && resetPasswordResponse.error) {
        toast({
          title: 'Reset Password Error.',
          description: resetPasswordResponse.errorMessage,
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }else {
        onClose();
        toast({
          title: 'Reset Password Successful.',
          description: 'Please follow instructions from reset password email to reset.',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })

      }
    }else {
      toast({
        title: 'Reset Password Error.',
        description: 'Please enter valid email.',
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
              >{`Reset Password`}
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
                                      <Th>
                                        <Box>
                                          <Text>
                                              Please enter email to reset password.
                                          </Text>
                                        </Box>
                                      </Th>

                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    <Tr >
                                        <Th>
                                          <Input type="email" placeHolder="User Name/ Email" width="100%" onChange={(ev) => setEmail(ev.target.value)}/>
                                        </Th>
                                    </Tr>
                             
                                  </Tbody>
                                  
                                </Table>
                              </TableContainer>      
                            </Box>                            

                            <Button className="btn" onClick={() => handleResetPassword()} width="button.primary.width" bgColor="button.primary.color">
                              Reset Password
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default UserResetPassword;
