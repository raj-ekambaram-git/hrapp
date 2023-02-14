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

const AddEditVedorPaymentAccount = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [isAddMode, setAddMode] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    function handleAddEditAccount(newSize) {
        setSize(newSize);
        onOpen();
        if(props.accountFeature && props.accountFeature.configuration) {
            setAddMode(false)
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
                          <Stack spacing={6} marginTop={9}>
                                                                                                   
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
                         
        </>
    );
};

export default AddEditVedorPaymentAccount;