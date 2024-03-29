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
    useToast,
    Stack,
    Checkbox
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../../../constants/accountConstants";
import { ExpenseConstants } from "../../../../constants/expenseConstants";
import { ErrorMessage } from "../../../../constants/errorMessage";
import { expenseService, paymentService, userService } from "../../../../services";
import { util } from "../../../../helpers/util";
import { ShowInlineErrorMessage } from "../../../common/showInlineErrorMessage";
import { useDispatch } from "react-redux";
import { setExpensePaidAmount, updateExpenseTransactions } from "../../../../store/modules/Expense/actions";
import { Spinner } from "../../../common/spinner";
  
const AddEditTransaction = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [tranAmount, setTranAmount] = useState(EMPTY_STRING);
    const [tranReferenceNo, setTranReferenceNo] = useState(EMPTY_STRING);
    const [tranStatus, setTranStatus] = useState(EMPTY_STRING);
    const [tranNotes, setTranNotes] = useState(EMPTY_STRING);
    const [supplierPayment, setSupplierPayment] = useState();
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const [loading, setLoading] = useState(false);
    const [useSupplierPayment, setUseSupplierPayment] = useState(false);
    
    const expenseId = props.expenseId;


    async function handleTransacionSubmit() {
        //Validate if the values are present and thorw error if any field is not entered
        if(tranAmount !== undefined && tranAmount !== EMPTY_STRING && util.getZeroPriceForNull(tranAmount) > 0
            && tranReferenceNo !== undefined && tranReferenceNo !== EMPTY_STRING
            && tranStatus !== undefined && tranStatus !== EMPTY_STRING
            && tranNotes !== undefined && tranNotes !== EMPTY_STRING) {
                setLoading(true)
                const expenseTransData= {
                    amount: tranAmount,
                    transactionData: tranNotes,
                    status: tranStatus,
                    expenseId: expenseId,
                    transactionId: tranReferenceNo
                };
                const responseData = await expenseService.createExpenseTransaction(expenseTransData, userService.getAccountDetails().accountId);

                if(responseData.error) {
                    toast({
                        title: 'New Expense Transaction.',
                        description: 'Error creating transaction for this expense. Details::'+responseData.errorMessage,
                        status: 'error',
                        position: 'top',
                        duration: 9000,
                        isClosable: true,
                      })
                      setLoading(false)
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
                      setLoading(false)
                      
                }
        }else {
            setShowErrorMessage(ErrorMessage.EXPENSE_TRANSACTION_FORM_ERROR);
            setLoading(false)
            return;
        }

        

    }

    const handleTransactionAddEdit = async() => {
        if(props.callType && props.callType === "PaymentTransaction" && props.transactionId && props.transactionAmount) {
            setTranReferenceNo(props.transactionId)
            setTranAmount(props.transactionAmount)
        } else if (props.callType && props.callType === "Cost") {
            console.log("Cost Add Transaction::"+props.supplierId)
            if(props.supplierId) {
                setLoading(true)
                const responseData = await paymentService.vendorPaymentAccount(props.supplierId, userService.getAccountDetails().accountId)
                console.log("SUPPLIER PAYMENT DATA:::"+JSON.stringify(responseData))
                setSupplierPayment(responseData)
                setLoading(false)
            }
            
            //Now get the Payment Method Details for the supplier where the cost is from
        }
        onToggle()
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
                            size="xs" bgColor="header_actions" 
                            onClick={() => handleTransactionAddEdit()}
                            key="xl"
                            m={1}
                            >{(props.callType && props.callType === "PaymentTransaction")?"Attach":`Add New`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    {loading?<><Spinner /></>:<></>} 
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
                                        <Input type="number" value={tranAmount} id="tranAmount"  onChange={(ev) => setTranAmount(ev.target.value)}  />
                                    </InputGroup>
                                    </Th>                                    
                                </Tr>
                                {supplierPayment?<>
                                    <Tr>
                                        <Th bgColor="table_tile">
                                            Saved Payment Details
                                        </Th>
                                        <Th>
                                            <Stack bgColor="table_tile" padding={1}>
                                                <Stack marginLeft={4}>
                                                <Box>
                                                    {supplierPayment.name}
                                                </Box>
                                                <Box>
                                                    {supplierPayment.bankName}
                                                </Box>
                                                <Box>
                                                    {supplierPayment.bankType}
                                                </Box>
                                                </Stack>

                                            </Stack>
                                        </Th>                                    
                                    </Tr> 
                                    <Tr>
                                        <Th bgColor="table_tile">
                                            Pay Now using above
                                        </Th>
                                        <Th>
                                            <Checkbox onChange={(e) => setUseSupplierPayment(e.target.checked)}/>                                
                                        </Th>
                                    </Tr>   
                                </>:<></>}
                                {((props.callType && props.callType === "PaymentTransaction" && props.transactionId)) ? <>    
                                </>: <>                                   
                                    <Tr>
                                        <Th bgColor="table_tile">
                                            Reference No.
                                        </Th>
                                        <Th>
                                            <Input type="text" id="tranReferenceNo" onChange={(ev) => setTranReferenceNo(ev.target.value)} />
                                        </Th>                                    
                                    </Tr>   
                                </>}
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
                        <Button colorScheme="yellow" size="xs" onClick={onClose} >Cancel</Button>
                        <Button colorScheme='red' size="xs" onClick={handleTransacionSubmit}>Apply</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default AddEditTransaction;