import React, { useState, useEffect } from "react";
import {
    useDisclosure,
    Button,
    Heading,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
  } from '@chakra-ui/react';

import { useSelector, useDispatch } from "react-redux";




const InvoiceTransaction = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [size, setSize] = useState('');

    useEffect(() => {
    }, []);

    function handleInvoiceTransactions(drawerSize) {
      setSize(drawerSize);
      onOpen();
    }

  return (
    <div>
        
        <Button
              onClick={() => handleInvoiceTransactions("lg")}
              key="xl"
              m={1}
              >{`Invoice Transactions`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader bgColor="heading">
                            <Heading as="h5" size="md">
                                Transactions
                            </Heading>
                        </DrawerHeader>
                        <DrawerBody>

                        </DrawerBody>
                    </DrawerContent>
          </Drawer>

    </div>


  );
};

export default InvoiceTransaction;
