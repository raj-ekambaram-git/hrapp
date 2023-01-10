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
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Text,
  } from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants/accountConstants";
import { ErrorMessage } from "../../constants/errorMessage";
import { util } from "../../helpers/util";
import { useDispatch, useSelector } from "react-redux";
import {setInvoiceEmailTo} from '../../store/modules/Invoice/actions';
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { invoiceService } from "../../services";

  
const AddInvoiceEmailTo = (props) => {
    const dispatch = useDispatch();
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [emailTo, setEmailTo] = useState(EMPTY_STRING);
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const invoiceId = useSelector(state => state.invoice.selectedInvoiceId);
    const invoiceEmailTo = useSelector(state => state.invoice.invoiceEmailTo);

    async function handleEmailToSubmit() {
        if(emailTo != undefined && emailTo != EMPTY_STRING && util.isValidEmail(emailTo)) {
            const localInvoiceEmailTo = [...invoiceEmailTo];
            localInvoiceEmailTo.push(emailTo);
            console.log("emailTo:::"+JSON.stringify(localInvoiceEmailTo))
            const responseData = await invoiceService.updateInvoiceEmailTo(invoiceId, localInvoiceEmailTo);
            dispatch(setInvoiceEmailTo(emailTo));
            setShowErrorMessage(EMPTY_STRING);
            onClose()
        }else {
            setShowErrorMessage(ErrorMessage.INVOICE_EMAIL_TO_FORM_ERROR);
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
                            >{`Add`}
                        </Button>  
                    </PopoverTrigger>
                    <PopoverContent>
                    <PopoverHeader>New Invoice Email To</PopoverHeader>
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
                                        Email To
                                    </Th>
                                    <Th>
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents='none'
                                                color='dollor_input'
                                                fontSize='dollar_left_element'
                                                children="Email"
                                            />      
                                            <Input type="email" id="emailTo" onChange={(ev) => setEmailTo(ev.target.value)} />
                                        </InputGroup>
                                    </Th>                                    
                                </Tr>   
                            </Tbody>
                        </Table>
                    </PopoverBody>
                    <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                        <Button variant='outline'  onClick={onClose} >Cancel</Button>
                        <Button colorScheme='red' onClick={handleEmailToSubmit}>Apply</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                    </PopoverContent>
                </Popover>                   
       </div>
      

 
    );
};

export default AddInvoiceEmailTo;