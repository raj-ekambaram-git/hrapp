import React, { useState, useEffect } from "react";

import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    useDisclosure,
    Select,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Box,
    Text,
    useToast
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../../../constants/accountConstants";
import { ExpenseConstants } from "../../../../constants/expenseConstants";
import { ErrorMessage } from "../../../../constants/errorMessage";
import { expenseService, userService } from "../../../../services";
import { util } from "../../../../helpers/util";
import { ShowInlineErrorMessage } from "../../../common/showInlineErrorMessage";
import { useDispatch } from "react-redux";
import { setExpensePaidAmount, updateExpenseTransactions } from "../../../../store/modules/Expense/actions";

  
const AddEditTransaction = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [tranAmount, setTranAmount] = useState(EMPTY_STRING);
    const [tranReferenceNo, setTranReferenceNo] = useState(EMPTY_STRING);
    const [tranStatus, setTranStatus] = useState(EMPTY_STRING);
    const [tranNotes, setTranNotes] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const expenseId = props.expenseId;


    async function handleTransacionSubmit() {
        //Validate if the values are present and thorw error if any field is not entered
        if(tranAmount !== undefined && tranAmount !== EMPTY_STRING && util.getZeroPriceForNull(tranAmount) > 0
            && tranReferenceNo !== undefined && tranReferenceNo !== EMPTY_STRING
            && tranStatus !== undefined && tranStatus !== EMPTY_STRING
            && tranNotes !== undefined && tranNotes !== EMPTY_STRING) {
                const expenseTransData= {
                    amount: tranAmount,
                    transactionData: tranNotes,
                    status: tranStatus,
                    expenseId: expenseId,
                    transactionId: tranReferenceNo
                };
                console.log("expenseTransData::::"+JSON.stringify(expenseTransData));
                const responseData = await expenseService.createExpenseTransaction(expenseTransData, userService.getAccountDetails().accountId);

                console.log("handleTransacionSubmit::::responseData::::"+JSON.stringify(responseData));
                if(responseData.error) {
                    toast({
                        title: 'New Expense Transaction.',
                        description: 'Error creating transaction foor this expense. Details::'+responseData.errorMessage,
                        status: 'error',
                        position: 'top',
                        duration: 9000,
                        isClosable: true,
                      })
                }else {
                    dispatch(updateExpenseTransactions(responseData.expenseTransaction));
                    dispatch(setExpensePaidAmount(responseData.finalPaidAmount));
                    onClose();
                    toast({
                        title: 'New Expense Transaction.',
                        description: 'Successfully added new expense transaction.',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                      })
                      
                }
        }else {
            setShowErrorMessage(ErrorMessage.EXPENSE_TRANSACTION_FORM_ERROR);
            return;
        }

    }

    return (
        <div>
                <Popover
                    returnFocusOnClose={true}
                    isOpen={isOpen}
                    onClose={onClose}
                    placement='bottom-start'
                    closeOnBlur={false}
                >
                    <PopoverTrigger>
                        <Button
                            bgColor="button.primary.color"
                            onClick={onToggle}
                            key="xl"
                            m={1}
                            >{`Add New`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>New Transaction</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Box>
                            <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                        </Box>
                        <Table>
                            <Thead>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Th bgColor="table_tile">
                                        Amount
                                    </Th>
                                    <Th>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents='none'
                                            color='dollor_input'
                                            fontSize='dollar_left_element'
                                            children='$'
                                        />      
                                        <Input type="number" id="tranAmount"  onChange={(ev) => setTranAmount(ev.target.value)}  />
                                    </InputGroup>
                                    </Th>                                    
                                </Tr>
                                <Tr>
                                    <Th bgColor="table_tile">
                                        Reference No.
                                    </Th>
                                    <Th>
                                        <Input type="text" id="tranReferenceNo" onChange={(ev) => setTranReferenceNo(ev.target.value)} />
                                    </Th>                                    
                                </Tr>   
                                <Tr>
                                    <Th bgColor="table_tile">
                                        Status
                                    </Th>
                                    <Th>
                                        <Select width="100%" id="tranStatus" onChange={(ev) => setTranStatus(ev.target.value)}>
                                            <option value="">Select Transaction Status</option>
                                            {ExpenseConstants.EXPENSE_TRAN_STATUS_LOOKUP?.map((expenseTranStatus) => (
                                                    <option value={expenseTranStatus.expenseTranStatusId}>{expenseTranStatus.expenseTranStatusName}</option>
                                            ))}                                  
                                        </Select>

                                    </Th>                                    
                                </Tr>    
                                <Tr>
                                    <Th bgColor="table_tile">
                                        Transaction Notes
                                    </Th>
                                    <Th>
                                        <Textarea type="text" id="tranNotes"  onChange={(ev) => setTranNotes(ev.target.value)} />
                                    </Th>                                    
                                </Tr>                                                                                         
                            </Tbody>
                        </Table>
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                        <Button variant='outline'  onClick={onClose} >Cancel</Button>
                        <Button colorScheme='red' onClick={handleTransacionSubmit}>Apply</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default AddEditTransaction;