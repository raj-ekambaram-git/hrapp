import React, { useState, useEffect } from "react";
import {
    useDisclosure,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Stack,
    HStack
  } from '@chakra-ui/react';

import { useSelector, useDispatch } from "react-redux";
import { fetchExpenseTransactions } from "../../../../store/modules/Expense/actions";
import { userService } from "../../../../services";
import { EMPTY_STRING } from "../../../../constants/accountConstants";
import AddEditTransaction from "./addEditTransaction";

const ExpenseTransactions = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [size, setSize] = useState(EMPTY_STRING);

    const expenseTransactions = useSelector(state => state.expense.expenseTransactions);

    useEffect(() => {
      dispatch(fetchExpenseTransactions(props.expenseId,userService.getAccountDetails().accountId))
    }, []);

  return (
    <div>
 
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
                {expenseTransactions?.map((expenseTransaction) => (
                  <Tr>
                      <Th>
                          {expenseTransaction.id}
                      </Th>
                      <Th>
                          $ {expenseTransaction.amount}
                      </Th>
                      <Th>
                          {expenseTransaction.transactionId}
                      </Th>                                          
                      <Th>
                          {expenseTransaction.status}
                      </Th>
                      <Th>
                          {expenseTransaction.lastUpdatedDate}
                      </Th>
                      <Th>
                          {expenseTransaction.transactionData}
                      </Th>
                  </Tr>
                ))}
                <Tr bgColor="table_tile">
                    <Th alignItems="right">
                        Total:
                    </Th>
                    <Th>
                        ${props.paidAmount}
                    </Th>
                </Tr>                
              </Tbody>  
            </Table>      
            {/* {util.getZeroPriceForNull(invoiceTotal) > util.getZeroPriceForNull(invoicePaidAmount) ? ( */}
                <HStack>
                  <Button variant='outline'  onClick={onClose} >Cancel</Button>
                  <AddEditTransaction isAddMode={true} expenseId={props.expenseId}/>
                </HStack>
            {/* ) : (
                <></>
              )} */}
          </Stack>

    </div>


  );
};

export default ExpenseTransactions;
