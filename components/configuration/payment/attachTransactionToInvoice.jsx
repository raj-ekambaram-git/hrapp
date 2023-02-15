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
import { util } from "../../../helpers";
import InvoiceTransactions from "../../invoice/transaction/invoiceTransactions";
import AddEditTransaction from "../../invoice/transaction/addEditTransaction";

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
            populateInvoieListForDisplay(responseData)
            setSize(newSize);
            onOpen();    
        }
      }

      const populateInvoieListForDisplay = (responseData) => {                
        const updatedInvoiceList = responseData.map((invoice) => {
            // invoice.attachAction= <InvoiceTransactions invoiceId={invoice.id} invoicePaidAmount={invoice.paidAmount} callType="PaymentTransaction"/>
            invoice.attachAction = <AddEditTransaction isAddMode={true} invoiceId={invoice.id}/>
            
            if((parseFloat(invoice.total)-parseFloat(invoice.paidAmount))>=(-parseFloat(props.transactionAmount))) {
                return invoice;
            }
            
        })
        
        setInvoiceList(updatedInvoiceList)

      }


    return (
        <>
          <Button size="xs" bgColor="header_actions" onClick={() => handleTransactionAsPaid("xxl")}>Attach Invoice</Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Attach transction to an invoice
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
                                                    {util.getWithCurrency(-props.transactionAmount)}
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
        </>
    );
};

export default AttachTransactionToInvoice;