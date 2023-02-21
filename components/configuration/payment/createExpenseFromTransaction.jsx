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
    Text,
    CardFooter,
    ButtonGroup

  } from '@chakra-ui/react';
  
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../../../services";
import { PaymentConstants } from "../../../constants";
import { CustomTable } from "../../customTable/Table";
import { util } from "../../../helpers";
import { ExpenseTypeLookup } from "../../../data/exponseType";
import { ExpenseEntryStatus } from "@prisma/client";
import { setExpenseEntryFromPayTrans } from "../../../store/modules/Expense/actions";

const CreateExpenseFromTransaction = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [expenseList, setExpenseList] = useState([]);
    const [disableAddEntry, setDisableAddEntry] = useState(false);
    const [expenseEntryType, setExpenseEntryType] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => PaymentConstants.NEW_EXPENSE_LIST_TABLE_META)
    const expenseEntriesFromPayTrans = useSelector(state => state.expense.expenseEntryFromPayTran);

    const addToNewExpense = async(newSize, isChecked) => {        
        if(isChecked) {
            setSize(newSize);
            onOpen();      
            populateExpenseListForDisplay(expenseEntriesFromPayTrans)  
        } else {
            if(props.transactionId && props.transactionAmount) {
                const newExpenseList = [...expenseEntriesFromPayTrans]
                //Remove taht id from the list
                const expenseListIdByIndex = newExpenseList.findIndex(x => x.notes === props.transactionId);
                newExpenseList.splice(expenseListIdByIndex, 1);
                dispatch(setExpenseEntryFromPayTrans(newExpenseList))
                populateExpenseListForDisplay(newExpenseList)
                setExpenseEntryType(null);
            } 
        }
      }

      const populateExpenseListForDisplay = (responseData) => {          

        const transactionList =  responseData.map((transaction, index)=> {
            return transaction;
        });
        setExpenseList(transactionList)
      }

      const handleAddTransactionToExpense = () => {
        
        if(props.transactionId && props.transactionAmount && expenseEntryType) {
            const expenseEntry = {
                status: ExpenseEntryStatus.Approved,
                type: expenseEntryType,
                amount: props.transactionAmount,
                billable: false,
                notes: props.transactionId,
            }

            const newExpenseList = [...expenseEntriesFromPayTrans]
            newExpenseList.push(expenseEntry)
            dispatch(setExpenseEntryFromPayTrans(newExpenseList))
            populateExpenseListForDisplay(newExpenseList)
            setExpenseEntryType(null);
            setDisableAddEntry(true)
        } else {
            toast({
                title: 'Create Expense Error.',
                description: 'Not able to create expense, plrease try again or contact administrator. Please make sure all the fields are entered.',
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })
              return;
        }
        
        
      }

      const addMoreTransactionToExpense = () => {
        setExpenseEntryType(null);
        onClose();        
      }

    return (
        <>
          <Checkbox onChange={(e) => addToNewExpense("xxl",e.target.checked)} />

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
                                    <Stack spacing={5}>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Transaction ID
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                {props.transactionId}
                                            </Box>                                    
                                        </HStack>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Amount
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                <Text color={props.transactionAmount>0?"pending_status":"paid_status"}>
                                                    {util.getWithCurrency(props.transactionAmount)}
                                                </Text>
                                                
                                            </Box>
                                        </HStack>
                                        <HStack spacing={3}>
                                            <Box textAlign="right" width="15%">
                                                Expense Type
                                            </Box>
                                            <Box textAlign="left" fontWeight="600">
                                                <Select id="type" onChange={(ev) => setExpenseEntryType(ev.target.value)}>
                                                    <option value="">Select Expense</option>
                                                    {ExpenseTypeLookup.map((expenseType) => (
                                                        <>
                                                        {((userService.isAccountAdmin() && expenseType.typeId === "Resource_Cost")
                                                        || (expenseType.typeId != "Resource_Cost"))?<option value={expenseType.typeId} >{expenseType.typeName}</option>:""}                                
                                                        </>
                                                    ))}
                                                </Select>  
                                                
                                            </Box>
                                        </HStack>                                        
                                    </Stack>
                                </CardBody>
                                <CardFooter>
                                    <ButtonGroup size='sm' spacing={4}>
                                        <Button colorScheme='yellow' size="xs" onClick={addMoreTransactionToExpense} >Cancel</Button>
                                        <Button bgColor="header_actions" size="xs" onClick={addMoreTransactionToExpense} >Add More</Button>
                                        {disableAddEntry?<></>:<>
                                            <Button colorScheme='red' size="xs" onClick={handleAddTransactionToExpense}>Add</Button>                                        
                                        </>}                                        
                                    </ButtonGroup>

                                </CardFooter>
                            </Card>
                            <CustomTable columns={EXPENSE_LIST_TABLE_COLUMNS} rows={expenseEntriesFromPayTrans} />                                                               
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>                      
        </>
    );
};

export default CreateExpenseFromTransaction;