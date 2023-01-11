import React, { useState, useEffect } from "react";
import {
    useDisclosure,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Stack,
    Box,
    HStack
  } from '@chakra-ui/react';

import { useSelector, useDispatch } from "react-redux";
import { fetchInvoiceTransactions } from "../../../store/modules/Invoice/actions";
import { userService } from "../../../services";
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { util } from "../../../helpers/util";
import AddEditTransaction from "./addEditTransaction";

const InvoiceTransactions = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [size, setSize] = useState(EMPTY_STRING);
    console.log("props.invoiceId::"+props.invoiceId)

    const invoiceTransactions = useSelector(state => state.invoice.invoiceTransactions);
    const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
    const invoicePaidAmount = useSelector(state => state.invoice.invoicePaidAmount);


    useEffect(() => {
      dispatch(fetchInvoiceTransactions(props.invoiceId,userService.getAccountDetails().accountId))
    }, []);

    function handleInvoiceTransactions(drawerSize) {
      setSize(drawerSize);
      onOpen();
    }

  return (
    <div>
        
        <Button
              size="xs"
              bgColor="header_actions"
              onClick={() => handleInvoiceTransactions("xl")}
              key="xl"
              m={1}
              >{`Payments Received`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                                Transactions
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing="2rem">
                            <Table variant="invoice_transaction">
                              <Thead>
                                  <Tr bgColor="table_tile">
                                      <Th>
                                          ID
                                      </Th>
                                      <Th>
                                          Amount
                                      </Th>   
                                      <Th>
                                          Reference No.
                                      </Th>                                          
                                      <Th>
                                          Status
                                      </Th>                                                                
                                      <Th>
                                          Date
                                      </Th>
                                      <Th>
                                          Notes
                                      </Th>  
                                  </Tr>   
                              </Thead>   
                              <Tbody>
                                {invoiceTransactions?.map((invoiceTransaction) => (
                                  <Tr>
                                      <Th>
                                          {invoiceTransaction.id}
                                      </Th>
                                      <Th>
                                          $ {invoiceTransaction.amount}
                                      </Th>
                                      <Th>
                                          {invoiceTransaction.transactionId}
                                      </Th>                                          
                                      <Th>
                                          {invoiceTransaction.status}
                                      </Th>
                                      <Th>
                                          {/* {util.getFormattedDate(invoiceTransaction.lastUpdatedDate)} */}
                                          {invoiceTransaction.lastUpdatedDate}
                                      </Th>
                                      <Th>
                                          {invoiceTransaction.transactionData}
                                      </Th>
                                  </Tr>
                                ))}
                              </Tbody>  
                            </Table>      
                            {/* {util.getZeroPriceForNull(invoiceTotal) > util.getZeroPriceForNull(invoicePaidAmount) ? ( */}
                                <HStack>
                                  <Button variant='outline'  onClick={onClose} >Cancel</Button>
                                  <AddEditTransaction isAddMode={true} invoiceId={props.invoiceId}/>
                                </HStack>
                            {/* ) : (
                                <></>
                              )} */}
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default InvoiceTransactions;
