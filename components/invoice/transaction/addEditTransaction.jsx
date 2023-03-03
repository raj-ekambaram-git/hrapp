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
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { InvoiceConstants } from "../../../constants/invoiceConstants";
import { ErrorMessage } from "../../../constants/errorMessage";
import { invoiceService, userService } from "../../../services";
import { util } from "../../../helpers/util";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";
import { useDispatch } from "react-redux";
import { setInvoicePaidAmount, updateInvoiceTransactions } from "../../../store/modules/Invoice/actions";

  
const AddEditTransaction = (props) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [tranAmount, setTranAmount] = useState(EMPTY_STRING);
    const [tranReferenceNo, setTranReferenceNo] = useState(EMPTY_STRING);
    const [tranStatus, setTranStatus] = useState(EMPTY_STRING);
    const [tranNotes, setTranNotes] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const invoiceId = props.invoiceId;


    async function handleTransacionSubmit() {
        //Validate if the values are present and thorw error if any field is not entered
        if(tranAmount !== undefined && tranAmount !== EMPTY_STRING && util.getZeroPriceForNull(tranAmount) > 0
            && tranReferenceNo !== undefined && tranReferenceNo !== EMPTY_STRING
            && tranStatus !== undefined && tranStatus !== EMPTY_STRING
            && tranNotes !== undefined && tranNotes !== EMPTY_STRING) {
                const invoiceTransData= {
                    amount: tranAmount,
                    transactionData: tranNotes,
                    status: tranStatus,
                    invoiceId: invoiceId,
                    transactionId: tranReferenceNo
                };
                const responseData = await invoiceService.createInvoiceTransaction(invoiceTransData, userService.getAccountDetails().accountId);
                if(responseData.error) {
                    toast({
                        title: 'New Invoice Transaction.',
                        description: 'Error creating transaction foor this invoice. Details::'+responseData.errorMessage,
                        status: 'error',
                        position: 'top',
                        duration: 9000,
                        isClosable: true,
                      })
                }else {
                    dispatch(updateInvoiceTransactions(responseData.invoiceTransaction));
                    dispatch(setInvoicePaidAmount(responseData.finalPaidAmount));
                    onClose();
                    toast({
                        title: 'New Invoice Transaction.',
                        description: 'Successfully added new invoice transaction.',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                      })
                      
                }
        }else {
            setShowErrorMessage(ErrorMessage.INVOICE_TRANSACTION_FORM_ERROR);
            return;
        }

    }

    const handleTransactionAddEdit = () => {
        if(props.callType && props.callType === "PaymentTransaction" && props.transactionId && props.transactionAmount) {
            setTranReferenceNo(props.transactionId)
            setTranAmount(props.transactionAmount)
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
                            size="xs"
                            bgColor="header_actions" 
                            onClick={() => handleTransactionAddEdit()}
                            key="xl"
                            m={1}
                            >{(props.callType && props.callType === "PaymentTransaction")?"Attach":`Add New`}
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
                                        <Input type="number" id="tranAmount"  value={tranAmount} onChange={(ev) => setTranAmount(ev.target.value)}  />
                                    </InputGroup>
                                    </Th>                                    
                                </Tr>
                                {(props.callType && props.callType === "PaymentTransaction" && props.transactionId) ? <>                                       
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
                                            {InvoiceConstants.INVOICE_TRAN_STATUS_LOOKUP?.map((invoiceTranStatus) => (
                                                    <option value={invoiceTranStatus.invoiceTranStatusId}>{invoiceTranStatus.invoiceTranStatusName}</option>
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