import React, { useState } from "react";

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
    const [transactions, setransactions] = useState(props.paymentTransactions);



    return (
        <>
        {props.paymentTransactions?<>
            <Card>
                <CardHeader>
                    Payment Transactions for last 30 days
                </CardHeader>
                <CardBody>
                    {JSON.stringify(props.paymentTransactions)}
                </CardBody>
                <CardFooter>
                    
                </CardFooter>
            </Card>       
        </>:<></>}                         
        </>
    );
};

export default PaymentTransactions;