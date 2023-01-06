import React, { useState } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Stack,
    StackDivider,
    useDisclosure,
    Button,
    Select,
    Input,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Box,
    TableContainer,
    TableCaption,
    InputGroup,
    InputLeftElement,
    Tooltip
  } from '@chakra-ui/react';
import {
    EmailIcon
  } from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";

const InvoiceEmailTo = (props) => {
    const {data} = props;
    const dispatch = useDispatch();
  
    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const invoiceEmailTo = useSelector(state => state.invoice.invoiceEmailTo);

    function handleInvoiceEmailTo(newSize) {
        setSize(newSize);
        onOpen();
    }

    function handleInvoiceEmailToAdd() {

    }

    return (
        <div>

            <Tooltip label={invoiceEmailTo.map((emailTo) => <p>{emailTo}</p>)}>
            <EmailIcon boxSize={8} onClick={() => handleInvoiceEmailTo("md")}/>
            </Tooltip>

            <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                    Invoice Email To
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <Box border="box_border">
                                    <Table>
                                        <TableCaption></TableCaption>
                                        <Thead></Thead>
                                        <Tbody>
                                            <Tr >
                                            </Tr>
                                        </Tbody>
                                    </Table>
  
                                </Box>                            
                                <Button onClick={() => handleInvoiceEmailToAdd()}>
                                  Add
                                </Button>
                            </Stack>
                        </DrawerBody>
                    </DrawerContent>                    
            </Drawer>         
        </div>
    );
};

export default InvoiceEmailTo;