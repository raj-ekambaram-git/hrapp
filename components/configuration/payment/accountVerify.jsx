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
import { configurationService, userService } from "../../../services";

const AccountVerify = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [processor, setProcessor] = useState();
    const [processorKey, setProcessorKey] = useState();
    const [processorSecret, setProcessorSecret] = useState();
    const [isAddMode, setAddMode] = useState(true);
    const [processorConsent, setProcessorConsent] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    function handleConfigurePaymentProcessor(newSize) {
        setSize(newSize);
        onOpen();
        if(props.accountFeature && props.accountFeature.configuration) {
            setAddMode(false)
            setProcessor(props.accountFeature.configuration?.processor)
            setProcessorKey(props.accountFeature.configuration?.processorKey)
            setProcessorConsent(props.accountFeature.configuration?.processorConsent)
        }
      }

    const handleAddUpdateProcessor = async () => {
        if(processorConsent) {
            if(processor && processor != EMPTY_STRING && processorKey && processorSecret) {
                const featureConfigUpdateData = {
                    id: props.accountFeature.accountFeatureId,
                    accountId: userService.getAccountDetails().accountId,
                    configuration: {
                        processor: processor,
                        processorConsent: processorConsent,
                        processorKey: processorKey,
                        processorSecret: processorSecret
                    }
                }
                const responseData = await configurationService.updateFeatureConfig(props.accountFeature.accountFeatureId, featureConfigUpdateData)
                if(responseData.error) {
                    toast({
                        title: 'Add Payment Processor.',
                        description: 'Error creating payment processor configuration, please try again later or contact administrator.',
                        status: 'error',
                        position: 'top',
                        duration: 9000,
                        isClosable: true,
                      })     
                      return;
                } else {
                    toast({
                        title: 'Add Payment Processor.',
                        description: 'Successfully add payment processor configuratiion.',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                      })     
                      onClose()
                }
            } else {
                toast({
                    title: 'Add Payment Processor.',
                    description: 'All the fields are required, please enter and try again.',
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                  })     
                  return;
            }
        } else {
            toast({
                title: 'Add Payment Processor.',
                description: 'Please accept the consent to add new payment processor.',
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
          <Button size="xs" colorScheme="red"
              onClick={() => handleConfigurePaymentProcessor("lg")}
              key="lg"
              m={1}
              >{`Verify Account`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Verify Account
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={6} marginTop={9}>
                            <HStack spacing={1}>
                                <Box alignContent="right" width="28%">
                                    Porcessor Name
                                </Box>
                                <Box alignContent="left">
                                    <Select  value={processor} onChange={(ev) => setProcessor(ev.target.value)} border="table_border">
                                        <option value="">Select Processor</option>
                                        {ConfigConstants.AVAILABLE_PAYMENT_PROCESSORS?.map((payPorcessor) => (
                                                <option value={payPorcessor.processorId}>{payPorcessor.processorName}</option>
                                        ))}                                           
                                    </Select>
                                </Box>   
                            </HStack>      
                            <HStack spacing={1}>
                                <Box alignContent="right" width="40%">
                                    Porcessor API Key
                                </Box>
                                <Box alignContent="left" width="100%">
                                    <Input type="text" value={processorKey} onChange={(ev) => setProcessorKey(ev.target.value)}/>
                                </Box>   
                            </HStack>   
                            <HStack spacing={1}>
                                <Box alignContent="right" width="40%">
                                    Porcessor API Secret
                                </Box>
                                <Box alignContent="left" width="100%">
                                    <Input type="password" value={processorSecret} onChange={(ev) => setProcessorSecret(ev.target.value)}/>
                                </Box>   
                            </HStack>  
                            <Box>
                            <Checkbox
                                isChecked={processorConsent?true:false}
                                onChange={(e) => setProcessorConsent(e.target.checked)}
                            /> Consent     
                            </Box>  
                            <Button width="30%" marginTop="20px" onClick={() => handleAddUpdateProcessor()} bgColor="header_actions">
                              {isAddMode ? (<>
                                  Add                               
                              </>) : (<>
                                  Update
                              </>)}
                            </Button>                                                                                                        
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>                      
        </>
    );
};

export default AccountVerify;