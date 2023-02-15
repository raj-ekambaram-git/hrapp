import React, { useEffect, useState } from "react";

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

const PaymentTransactions = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [transactions, setTransactions] = useState();

    useEffect(() => {
        setTransactions(props.paymentTransactions)
      }, [props.paymentTransactions]);

    return (
        <>
        {transactions?<>
            <Card variant="paymentTransactions">
                <CardHeader>
                    Payment Transactions for last 30 days
                </CardHeader>
                <CardBody>
                    {JSON.stringify(transactions)}
                </CardBody>
                <CardFooter>
                    
                </CardFooter>
            </Card>       
        </>:<></>}                         
        </>
    );
};

export default PaymentTransactions;