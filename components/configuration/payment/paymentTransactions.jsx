import React, { useState } from "react";

import {

    Button,
    useDisclosure,
    useToast,

  } from '@chakra-ui/react';
  import { Spinner } from "../../common/spinner";
import { useDispatch } from "react-redux";
import { ConfigConstants, EMPTY_STRING, PaymentConstants } from "../../../constants";
import { configurationService, paymentService, userService } from "../../../services";

const PaymentTransactions = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [routingNumber, setRoutingNumber] = useState();
    const [accountNumber, setAccountNumber] = useState();
    const [bankName, setBankName] = useState();
    const [bankType, setBankType] = useState();
    const [vendorPaymentSummary, setVendorPaymentSummary] = useState();
    const [isAddMode, setAddMode] = useState(true);
    const [isPageAuthorized, setPageAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    function handleAddEditAccount(newSize) {
        setSize(newSize);
        onOpen();     
        if(userService.isAccountAdmin() && userService.isPaymentAdmin()) {
            setPageAuthorized(true)
            getVendorPaymentAccount()   
        }
        

    }


    return (
        <>
       
                         
        </>
    );
};

export default PaymentTransactions;