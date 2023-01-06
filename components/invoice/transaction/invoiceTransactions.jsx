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

import {
  DeleteIcon
} from '@chakra-ui/icons';

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
              onClick={() => handleInvoiceTransactions("xl")}
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
                          <Stack spacing="2rem">
                            <Table variant="invoice_transaction">
                              <Thead>
                                  <Tr bgColor="table_tile">
                                      <Th>
                                          
                                      </Th>                                    
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
                                      <HStack spacing={4}>
                                        <DeleteIcon onClick={() => deleteProjectResource(projectResource.id,projectResource.budgetAllocated)}/>
                                        {/* <AddEditTransaction/> */}
                                      </HStack>
                                      </Th>                                    
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
                                          {util.getFormattedDate(invoiceTransaction.lastUpdatedDate)}
                                      </Th>
                                      <Th>
                                          {invoiceTransaction.transactionData}
                                      </Th>
                                  </Tr>
                                ))}
                              </Tbody>  
                            </Table>      
                            {parseFloat(invoiceTransactions[0]?.invoice?.total) > parseFloat(invoiceTransactions[0]?.invoice?.paidAmount) ? (
                                <Box>
                                  <AddEditTransaction/>
                                </Box>
                            ) : (
                                <></>
                              )}
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default InvoiceTransactions;
