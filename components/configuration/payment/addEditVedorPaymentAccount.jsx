import React, { useState } from "react";

import {

    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Stack,
    useDisclosure,
    useToast,
    HStack,
    Input,
    Checkbox,
    Select

  } from '@chakra-ui/react';
  
import { useDispatch } from "react-redux";
import { ConfigConstants, EMPTY_STRING } from "../../../constants";
import { configurationService, paymentService, userService } from "../../../services";

const AddEditVedorPaymentAccount = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [routingNumber, setRoutingNumber] = useState();
    const [accountNumber, setAccountNumber] = useState();
    const [bankName, setBankName] = useState();
    const [bankType, setBankType] = useState();
    const [isAddMode, setAddMode] = useState(true);
    const [isPageAuthorized, setPageAuthorized] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    function handleAddEditAccount(newSize) {
        setSize(newSize);
        onOpen();     
        if(userService.isAccountAdmin() && userService.isPaymentAdmin()) {
            setPageAuthorized(true)
            getVendorPaymentAccount()   
        }
        

      }

      const getVendorPaymentAccount = async() => {
        const responseData = await paymentService.vendorPaymentAccount(props.vendorId, userService.getAccountDetails().accountId)
        if(responseData) {
            setAddMode(false)
            setBankType(responseData.bankType)
            setBankName(responseData.bankName)
            setRoutingNumber(responseData.routingNumber)
            setAccountNumber(responseData.accountNumber)
        }
      }

      const handleAddUpdateVendorPaymentAccount = async() => {

        if(bankType && bankType != EMPTY_STRING && bankName && routingNumber && accountNumber) {
            const paymentAccountData = {
                bankType: bankType,
                bankName: bankName,
                routingNumber: routingNumber,
                accountNumber: accountNumber
            }
            const responseData = await paymentService.paymentAccount(props.vendorId, userService.getAccountDetails().accountId, userService.userValue.id, paymentAccountData)
            if(responseData.error) {
                toast({
                    title: 'Add Vendor Payment Account.',
                    description: 'Error adding new payment account for this vendor, please try again later or contact administrator.',
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                  })     
                  return;
            } else {

                toast({
                    title: 'Add Vendor Payment Account.',
                    description: 'Successfully added new payment account for this vendor.',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                  })     
                  return;
            }
        } else {
            toast({
                title: 'Add Vendor Payment Account.',
                description: 'All the fields are required, please enter and try again.',
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })     
              return;
        }
        

      }


    return (
        <>

          <Button size="xs" bgColor="header_actions" 
              onClick={() => handleAddEditAccount("xl")}
              key="xl"
              m={1}
              >{`Add/Edit Payment Details`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Add Vendor Payment
                        </DrawerHeader>
                        <DrawerBody>
                        {isPageAuthorized?<>
                            <Stack spacing={6} marginTop={9}>
                                <HStack spacing={1}>
                                    <Box alignContent="right" width="20%">
                                        Bank Type
                                    </Box>
                                    <Box alignContent="left" width="40%">
                                        <Select  value={bankType} onChange={(ev) => setBankType(ev.target.value)} border="table_border">
                                            <option value="">Select Type</option>
                                            {ConfigConstants.AVAILABLE_PAYMENT_ACCOUNT_TYPES?.map((paymentAccountType) => (
                                                    <option value={paymentAccountType.id}>{paymentAccountType.name}</option>
                                            ))}                                           
                                        </Select>
                                    </Box>   
                                </HStack>                                                                                                    
                                <HStack spacing={1}>
                                    <Box alignContent="right" width="20%">
                                        Bank Name
                                    </Box>
                                    <Box alignContent="left" width="40%">
                                        <Input type="text" value={bankName} onChange={(ev) => setBankName(ev.target.value)}/>
                                    </Box>   
                                </HStack>                                                                                                    
                                <HStack spacing={1}>
                                    <Box alignContent="right" width="20%">
                                        Routing Number
                                    </Box>
                                    <Box alignContent="left" width="40%">
                                        <Input type="number" value={routingNumber} onChange={(ev) => setRoutingNumber(ev.target.value)}/>
                                    </Box>   
                                </HStack>                                                                                                    
                                <HStack spacing={1}>
                                    <Box alignContent="right" width="20%">
                                        Account Number
                                    </Box>
                                    <Box alignContent="left" width="40%">
                                        <Input type="number" value={accountNumber} onChange={(ev) => setAccountNumber(ev.target.value)}/>
                                    </Box>   
                                </HStack>                                                                                                    
                                <Button width="30%" marginTop="20px" onClick={() => handleAddUpdateVendorPaymentAccount()} bgColor="header_actions">
                                {isAddMode ? (<>
                                    Add                               
                                </>) : (<>
                                    Update
                                </>)}
                                </Button>                                                                                                        

                            </Stack>                        
                        </>:<></>}

                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
                         
        </>
    );
};

export default AddEditVedorPaymentAccount;