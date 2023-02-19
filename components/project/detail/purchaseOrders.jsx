import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Badge,
  useToast
} from '@chakra-ui/react'
import {
  DeleteIcon
} from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";



const PurchaseOrders = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('');

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }


  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Purchase Orders`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Purchase Orders
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <Table variant="sortTable">
                                    <Thead>
                                      <Tr>
                                        <Th>
                                        </Th>
                                        <Th>
                                          ID
                                        </Th>
                                        <Th>
                                          Name
                                        </Th>
                                        <Th>
                                          Status
                                        </Th>
                                        <Th>
                                          Category
                                        </Th>
                                        <Th>
                                          Created On
                                        </Th>
                                        <Th>
                                          Created By
                                        </Th>
                                        <Th>
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                    </Tbody>                                    
                                  </Table>

                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default PurchaseOrders;
