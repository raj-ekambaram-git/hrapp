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
    Th
  } from '@chakra-ui/react';

import { useSelector, useDispatch } from "react-redux";
import { fetchInvoiceTransactions } from "../../../store/modules/Invoice/actions";
import { userService } from "../../../services";
import { EMPTY_STRING } from "../../../constants/accountConstants";
import { util } from "../../../helpers/util";






const InvoiceTransactions = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [size, setSize] = useState(EMPTY_STRING);
    console.log("props.invoiceId::"+props.invoiceId)

    const invoiceTransactions = useSelector(state => state.invoice.invoiceTransactions);

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
              onClick={() => handleInvoiceTransactions("lg")}
              key="xl"
              m={1}
              >{`Invoice Transactions`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                                Transactions
                        </DrawerHeader>
                        <DrawerBody>
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
                                        {invoiceTransaction.status}
                                    </Th>
                                    <Th>
                                        {util.getFormattedDate(invoiceTransaction.lastUpdatedDate)}
                                    </Th>
                                    <Th>
                                        {invoiceTransaction.transactionData}
                                    </Th>
                                </Tr>
                              ))}
                            </Tbody>  
                          </Table>           
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default InvoiceTransactions;
