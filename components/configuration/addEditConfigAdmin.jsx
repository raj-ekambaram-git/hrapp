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



const AddEditConfigAdmin = (props) => {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {data} = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const [appConfigLookupId, setAppConfigLookupId] = useState(EMPTY_STRING);
  const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

  const [name, setName] = useState(EMPTY_STRING);
  const [displayName, setDisplayName] = useState(EMPTY_STRING);
  const [configDescription, setConfigDescription] = useState(EMPTY_STRING);
  const [type, setType] = useState(EMPTY_STRING);
  const [possibleValue, setPossibleValue] = useState(EMPTY_STRING);
  const [status, setStatus] = useState(EMPTY_STRING);
  const [configInputType, setConfigInputType] = useState(EMPTY_STRING);


  function handleManageConfigAdmin(newSize) {
    setSize(newSize);
    onOpen();
  }

  useEffect(() => {
    setShowErrorMessage(EMPTY_STRING);

  }, []);

  return (

    <div>
      <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
          <Button size="xs" bgColor="header_actions" 
              onClick={() => handleManageConfigAdmin("lg")}
              key="lg"
              m={1}
              >{`Add Admin Configuration`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            New Config Admin
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
                                          <Input type="text" value={name} onChange={(ev) => setName(ev.target.value)}/>                                       
                                         </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Display Name
                                        </Th>
                                        <Th>
                                          <Input type="text" value={displayName} onChange={(ev) => setDisplayName(ev.target.value)}/>                                       
                                         </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Description
                                        </Th>
                                        <Th>
                                          <Textarea type="text"  value={configDescription} onChange={(ev) => setConfigDescription(ev.target.value)}/>                                       
                                         </Th>
                                    </Tr>
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Type
                                        </Th>
                                        <Th>
                                          <Select width="50%%" value={type} onChange={(ev) => setType(ev)} border="table_border">
                                            <option value="">Select Type</option>
                                              {ConfigConstants.CONFIG_LOOKUP_TYPE?.map((configType) => (
                                                      <option value={configType.typeId}>{configType.typeName}</option>
                                              ))}   
                                          </Select>

                                         </Th>
                                    </Tr>     
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Input Type
                                        </Th>
                                        <Th>
                                          <Select width="50%%" value={configInputType} onChange={(ev) => setConfigInputType(ev)} border="table_border">
                                            <option value="">Select Input Type</option>
                                              {ConfigConstants.CONFIG_LOOKUP_INPUT_TYPE?.map((inputType) => (
                                                      <option value={inputType.inputTypeId}>{inputType.inputTypeName}</option>
                                              ))}   
                                          </Select>

                                         </Th>
                                    </Tr>                                                                      
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Value
                                        </Th>
                                        <Th>
                                          <Input type="text" value={possibleValue} onChange={(ev) => setPossibleValue(ev.target.value)}/>                                                                                </Th>
                                    </Tr>                                                                        
                                    <Tr >
                                        <Th bgColor="table_tile">
                                          Status
                                        </Th>
                                        <Th>
                                          <Select width="50%%" value={status} onChange={(ev) => setStatus(ev)} border="table_border">
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
                            <Button  size="sm" width="30%" bgColor="button.primary.color">
                              Add Vendor
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
