import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useToast,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  Input,
  Textarea,
  Select
} from '@chakra-ui/react';

import { useDispatch } from "react-redux";
import { ConfigConstants, EMPTY_STRING } from "../../constants";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { configurationService, userService } from "../../services";
import ManageConfigurationValues from "./manageConfigurationValues";



const AddEditConfigAdmin = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const [appConfigId, setAppConfigId] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

  const [appConfigName, setAppConfigName] = useState(EMPTY_STRING);
  const [appConfigKey, setAppConfigKey] = useState(EMPTY_STRING);
  const [appConfigValue, setAppConfigValue] = useState([]);
  const [appConfigStatus, setAppConfigStatus] = useState(EMPTY_STRING);
  const [updatedBy, setUpdatedBy] = useState(EMPTY_STRING);
  
  function handleConfigValue(value) {
    const newConfigValue = [...appConfigValue]
    newConfigValue.push(value)
    setAppConfigValue(newConfigValue)
  }

  function handleManageAppConfigAdmin(newSize) {
    setSize(newSize);
    onOpen();
  }

  useEffect(() => {
    setShowErrorMessage(EMPTY_STRING);

  }, []);

  async function handleAppConfigAdmin() {
    const appConfigdminData = {
      name: appConfigName,
      key: appConfigKey,
      value: appConfigValue,
      status: appConfigStatus,
      updatedBy: parseInt(userService.userValue.id)
    }

    const responseData = await configurationService.createAppConfigAdmin(appConfigdminData)
    if(responseData.error) {
      toast({
        title: 'Add App Config.',
        description: 'Error adding new app configuration.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      return;
    }else {
      toast({
        title: 'Add App Config.',
        description: 'Successfully create new app configuration.',
        status: 'success',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      onClose();
    }
  }

  return (

    <div>
      <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
          <Button size="xs" bgColor="header_actions" 
              onClick={() => handleManageAppConfigAdmin("lg")}
              key="lg"
              m={1}
              >{`Add App Configuration`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            New App Config Admin
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={8}>
                              <Box>
                                <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                              </Box> 
                              <TableContainer>
                                <Table>
                                  <TableCaption></TableCaption>
                                  <Thead></Thead>
                                  <Tbody>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Name
                                        </Th>
                                        <Th>
                                          <Input type="text" value={appConfigName} onChange={(ev) => setAppConfigName(ev.target.value)}/>                                       
                                         </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Key
                                        </Th>
                                        <Th>
                                          <Input type="text" value={appConfigKey} onChange={(ev) => setAppConfigKey(ev.target.value)}/>                                       
                                         </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Value
                                        </Th>
                                        <Th>
                                        {appConfigValue?.map((value) => (
                                          <Tr>
                                              <Th>
                                            
                                              </Th>
                                              <Th>
                                                  {value}
                                              </Th>
                                          </Tr>                                                                                         
                                        ))}                                             
                                          <ManageConfigurationValues handleConfigValue={handleConfigValue}/>
                                         </Th>
                                    </Tr>                    
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Status
                                        </Th>
                                        <Th>
                                          <Select width="50%%" value={appConfigStatus} onChange={(ev) => setAppConfigStatus(ev.target.value)} border="table_border">
                                            <option value="">Select Type</option>
                                              {ConfigConstants.CONFIG_LOOKUP_STATUS?.map((status) => (
                                                      <option value={status.statusId}>{status.statusName}</option>
                                              ))}   
                                          </Select>

                                         </Th>
                                    </Tr>   
                                  </Tbody>
                                  
                                </Table>
                              </TableContainer>                                    
                            <Button  size="sm" width="30%" bgColor="button.primary.color" onClick={() => handleAppConfigAdmin()}>
                              Add App Configuration
                            </Button>                            
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </Flex>

    </div>


  );
};

export default AddEditConfigAdmin;
