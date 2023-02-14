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

const ConfigurePaymentProcessor = (props) => {
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
      }

    const handleAddUpdateProcessor = async () => {
        if(processorConsent) {
            if(processor && processor != EMPTY_STRING && processorKey && processorSecret) {
                const featureConfigUpdateData = {
                    id: props.accountFeatureId,
                    accountId: userService.getAccountDetails().accountId,
                    configuration: {
                        processor: processor,
                        processorConsent: processorConsent,
                        processorKey: processorKey,
                        processorSecret: processorSecret
                    }
                }
                console.log("featureConfigUpdateData:::::"+JSON.stringify(featureConfigUpdateData))
                const responseData = await configurationService.updateFeatureConfig(props.accountFeatureId, featureConfigUpdateData)
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
        <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
          <Button size="xs" bgColor="header_actions" 
              onClick={() => handleConfigurePaymentProcessor("lg")}
              key="lg"
              m={1}
              >{`Configure Payment Processor`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Configure Payment Processor 
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={6} marginTop={9}>
                            <HStack spacing={1}>
                                <Box alignContent="right" width="40%">
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
        </Flex>                              
        </>
    );
};

export default ConfigurePaymentProcessor;