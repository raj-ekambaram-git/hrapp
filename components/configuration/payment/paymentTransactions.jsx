import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {

    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    useDisclosure,
    useToast,

  } from '@chakra-ui/react';
import { Spinner } from "../../common/spinner";
import { useDispatch } from "react-redux";
import { PaymentConstants } from "../../../constants";
import { userService } from "../../../services";
import { CustomTable } from "../../customTable/Table";
import  AttachTransactionToInvoice from './attachTransactionToInvoice'

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
      }, [props.paymentTransactions]);


    const handleTransactionAsPaid = async(type, transactionId) => {

    }

    const populateTransactionTable = async(transactions) => {
        if(transactions && transactions.length>0) {
            const transactionList =  transactions.map((transaction, index)=> {
                console.log("transaction.transaction_marked_invoice::::"+transaction.transaction_marked)
            if(!transaction.transaction_marked) {
                //Enable CheckBox to include now
                if(parseFloat(transaction.transaction_amount) > 0) {
                    // This means we spent the money to expense
                    transaction.transaction_action = <Button size="xs" colorScheme="red"  onClick={() => handleTransactionAsPaid("Expense",transaction.transaction_id)}>Attach Expense</Button>
                } else {
                    // This means we received the money for invoice
                    transaction.transaction_action = <AttachTransactionToInvoice transactionId={transaction.transaction_id} />
                }                
            } else {
                transaction.transaction_action = <Button size="xs" onClick={() => handleTransactionAsPaid("Marked",transaction.transaction_id)}>Attached</Button>
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
                    Payment Transactions for last 30 days
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