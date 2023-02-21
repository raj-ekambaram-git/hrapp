import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {

    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Text,
    HStack,
    useDisclosure,
    useToast,
    Box,
    Select,

  } from '@chakra-ui/react';
import { Spinner } from "../../common/spinner";
import { useDispatch } from "react-redux";
import { PaymentConstants } from "../../../constants";
import { userService } from "../../../services";
import { CustomTable } from "../../customTable/Table";
import  AttachTransactionToInvoice from './attachTransactionToInvoice'
import  AttachTransactionToExpense from './attachTransactionToExpense'
import CreateExpenseFromTransaction from './createExpenseFromTransaction'
import { setExpenseEntryFromPayTrans, setExpenseEntryFromPayTransTotal } from "../../../store/modules/Expense/actions";

const PaymentTransactions = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [transactions, setTransactions] = useState();
    const [isPageAuthprized, setPageAuthorized] = useState(false);
    const TRANSACTION_LIST_TABLE_COLUMNS = React.useMemo(() => PaymentConstants.TRANSACTION_LIST_TABLE_META)

    useEffect(() => {
        if(userService.isSuperAdmin() || (userService.isAccountAdmin && userService.isPaymentAdmin)) {
            populateTransactionTable(props.paymentTransactions)
        }        
        dispatch(setExpenseEntryFromPayTrans([]))
        dispatch(setExpenseEntryFromPayTransTotal(null))
      }, [props.paymentTransactions]);


    const handleTransactionsAsMarked = async(transactionIds) => {
        const newPaymentTransacitons = [...props.paymentTransactions]
        const updatedList = newPaymentTransacitons.map(payTran => {
            if(transactionIds.includes(payTran.transaction_id)) {
                payTran["transaction_marked"] = true;
            }
            return payTran;
        })

        populateTransactionTable(updatedList)

    }


    const populateTransactionTable = async(transactions) => {
        if(transactions && transactions.length>0) {
            const transactionList =  transactions.map((transaction, index)=> {
            if(!transaction.transaction_marked) {

                //Enable CheckBox to include now
                if(parseFloat(transaction.transaction_amount) > 0) {
                    // This means we spent the money to expense
                    // transaction.transaction_action = <Button size="xs" colorScheme="red"  onClick={() => handleTransactionAsPaid("Expense",transaction.transaction_id)}>Attach Expense</Button>
                    transaction.transaction_action = <AttachTransactionToExpense transactionId={transaction.transaction_id} transactionAmount={transaction.transaction_amount} handleTransactionsAsMarked={handleTransactionsAsMarked}/>
                    transaction.open_transaction = <CreateExpenseFromTransaction transactionId={transaction.transaction_id} transactionAmount={transaction.transaction_amount} transactionDate={transaction.transaction_date} handleTransactionsAsMarked={handleTransactionsAsMarked}/>
                } else {
                    // This means we received the money for invoice
                    transaction.transaction_action = <AttachTransactionToInvoice transactionId={transaction.transaction_id} transactionAmount={transaction.transaction_amount} handleTransactionsAsMarked={handleTransactionsAsMarked}/>
                }                
                
            } else {
                transaction.transaction_action = <Button size="xs" isDisabled={true} onClick={() => handleTransactionAsPaid("Marked",transaction.transaction_id)}>Attached</Button>                
            }
          
            transaction.transaction_status=transaction.pending?"Pending":"Complete"                
        return transaction;
        });
        setTransactions(transactionList );
    }    
    }
    
    return (
        <>
        {transactions?<>
            <Card variant="paymentTransactions">
                <CardHeader>
                    <HStack spacing={9}>
                        <Text>
                            Payment Transactions for 
                        </Text>
                        <Box>
                            <Select id="type" onChange={(ev) => props.viewPaymentTransactions(props.paymentMethodId, ev.target.value)}>
                                <option value="30">Last 30 Days</option>
                                <option value="45">Last 45 Days</option>
                                <option value="60">Last 60 Days</option>
                                <option value="60">Last 90 Days</option>
                            </Select>  
                        </Box>
                        <Box justifyItems="right">
                            <CreateExpenseFromTransaction isViewMode={true}/>
                        </Box>                        
                    </HStack>
                    
                </CardHeader>
                <CardBody>
                    {/* {JSON.stringify(transactions)} */}
                    <CustomTable columns={TRANSACTION_LIST_TABLE_COLUMNS} rows={transactions} />
                </CardBody>
                <CardFooter>
                    
                </CardFooter>
            </Card>       
        </>:<></>}                         
        </>
    );
};

export default PaymentTransactions;