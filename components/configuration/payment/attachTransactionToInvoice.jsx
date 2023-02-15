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
    Select,
    CardHeader,
    CardBody,
    Card,
    Text

  } from '@chakra-ui/react';
  
import { useDispatch } from "react-redux";
import { invoiceService, userService } from "../../../services";
import { PaymentConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";

const AttachTransactionToInvoice = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [invoiceList, setInvoiceList] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const INVOICE_LIST_TABLE_COLUMNS = React.useMemo(() => PaymentConstants.INVOICE_LIST_TABLE_META)

    const handleTransactionAsPaid = async(newSize) => {
        const responseData = await invoiceService.invoicesNotPaid(userService.getAccountDetails().accountId, userService.userValue.id)
        if(responseData && responseData.error) {
            toast({
                title: 'Pending Invoices.',
                description: 'Error getting pending invoices, please try again later or contact administrator.',
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })  
        } else {
            setInvoiceList(responseData)
            setSize(newSize);
            onOpen();    
        }
      }



    return (
        <>
        <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
          <Button size="xs" bgColor="header_actions" onClick={() => handleTransactionAsPaid("xl")}>Attach Invoice</Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Attach transction to an Invoice
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={6} marginTop={9}>
                            <Card variant="paymentTransactions">
                                <CardHeader>
                                    Transaction Detail
                                </CardHeader>
                                <CardBody>
                                    <Stack spacing={3}>
                                        <HStack>
                                            <Box textAlign="right" width="15%">
                                                Transaction ID
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                {props.transactionId}
                                            </Box>                                    
                                        </HStack>
                                        <HStack>
                                            <Box textAlign="right" width="15%">
                                                Amount
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                <Text color={props.transactionAmount>0?"pending_status":"paid_status"}>
                                                    {props.transactionAmount}
                                                </Text>
                                                
                                            </Box>
                                        </HStack>
                                    </Stack>
                                </CardBody>
                            </Card>
                            <CustomTable columns={INVOICE_LIST_TABLE_COLUMNS} rows={invoiceList} />                                                               
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </Flex>                              
        </>
    );
};

export default AttachTransactionToInvoice;