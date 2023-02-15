import React, { useState } from "react";

import {

    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Stack,
    useDisclosure,
    useToast,
    HStack,
    Input,
    Checkbox,
    Select

  } from '@chakra-ui/react';
  
import { useDispatch } from "react-redux";
import { invoiceService, userService } from "../../../services";

const AttachTransactionToInvoice = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const handleTransactionAsPaid = async(newSize) => {
        const responseData = await invoiceService.invoicesNotPaid(userService.getAccountDetails().accountId, userService.userValue.id)
        setSize(newSize);
        onOpen();
      }



    return (
        <>
        <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
          <Button size="xs" bgColor="header_actions" onClick={() => handleTransactionAsPaid("lg")}>Attach Invoice</Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Attach transction to an Invoice
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={6} marginTop={9}>
                                                                                                     
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </Flex>                              
        </>
    );
};

export default AttachTransactionToInvoice;