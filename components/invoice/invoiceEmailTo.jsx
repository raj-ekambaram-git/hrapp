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
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Box,
    TableCaption,
    Tooltip
  } from '@chakra-ui/react';
import {
    EmailIcon, DeleteIcon
  } from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import AddInvoiceEmailTo from "./addInvoiceEmailTo";
import { removeEmailFromInvoiceEmailListByIndex } from "../../store/modules/Invoice/actions";



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
    function deleteInvoiceEmailTo(indexVal){
        dispatch(removeEmailFromInvoiceEmailListByIndex(indexVal));
    }

    return (
        <div>

            <Tooltip label={invoiceEmailTo.map((emailTo) => <p>{emailTo}</p>)}>
            <EmailIcon boxSize={8} onClick={() => handleInvoiceEmailTo("lg")}/>
            </Tooltip>

            <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                    Invoice Email To
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing="4">
                                <Box border="box_border">
                                    <Table>
                                        <TableCaption></TableCaption>
                                        <Thead>
                                            <Tr bgColor="table_tile">
                                                <Th>
                                                </Th>
                                                <Th>
                                                    Send Invoice To
                                                </Th>                                                
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                        {invoiceEmailTo?.map((emailTo, index) => (
                                            <Tr >
                                                <Th>
                                                    {(index != 0 && index!=1)? (
                                                        <DeleteIcon boxSize={4} onClick={() => deleteInvoiceEmailTo(index)}/> 
                                                    ) : (
                                                        <></>
                                                    ) }
                                                    
                                                </Th>
                                                <Th>
                                                    {emailTo}
                                                </Th>                                                
                                            </Tr>
                                        ))}
                                        </Tbody>
                                    </Table>
  
                                </Box>                            
                                <AddInvoiceEmailTo/>
                            </Stack>
                        </DrawerBody>
                    </DrawerContent>                    
            </Drawer>         
        </div>
    );
};

export default InvoiceEmailTo;