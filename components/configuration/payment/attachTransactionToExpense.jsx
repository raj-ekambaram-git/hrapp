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
import { expenseService, invoiceService, userService } from "../../../services";
import { PaymentConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";
import { util } from "../../../helpers";
import InvoiceTransactions from "../../invoice/transaction/invoiceTransactions";
import AddEditTransaction from "../../expense/payment/transaction/addEditTransaction";

const AttachTransactionToExpense = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [expenseList, setExpenseList] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => PaymentConstants.EXPENSE_LIST_TABLE_META)

    const handleTransactionAsPaid = async(newSize) => {
        const responseData = await expenseService.expensesNotPaid(userService.getAccountDetails().accountId, userService.userValue.id)
        if(responseData && responseData.error) {
            toast({
                title: 'Pending Expenses.',
                description: 'Error getting pending expenses, please try again later or contact administrator.',
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })  
        } else {
            populateExpenseListForDisplay(responseData)
            setSize(newSize);
            onOpen();    
        }
      }

      const populateExpenseListForDisplay = (responseData) => {          
        const updatedExpenseList =  [];
        responseData.map((expense) => {
            console.log("props.transactionAmount::"+props.transactionAmount+"expense.total:::"+expense.total+"****expense.paidAmount::"+expense.paidAmount)
            // invoice.attachAction= <InvoiceTransactions invoiceId={invoice.id} invoicePaidAmount={invoice.paidAmount} callType="PaymentTransaction"/>
            expense.attachAction = <AddEditTransaction isAddMode={true} expenseId={expense.id} callType="PaymentTransaction" transactionId={props.transactionId}  transactionAmount={props.transactionAmount} />
            
            if((parseFloat(expense.total)-parseFloat(expense.paidAmount))>=parseFloat(props.transactionAmount)) {
                updatedExpenseList.push(expense)
            }            
        })
        setExpenseList(updatedExpenseList)
      }


    return (
        <>
          <Button size="xs" colorScheme="red"  onClick={() => handleTransactionAsPaid("xxl")}>Attach Expense</Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Attach Expense Transction
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
                                                    {util.getWithCurrency(props.transactionAmount)}
                                                </Text>
                                                
                                            </Box>
                                        </HStack>
                                    </Stack>
                                </CardBody>
                            </Card>
                            <CustomTable columns={EXPENSE_LIST_TABLE_COLUMNS} rows={expenseList} />                                                               
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>                      
        </>
    );
};

export default AttachTransactionToExpense;