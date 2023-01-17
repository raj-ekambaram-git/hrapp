import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  useDisclosure,
  Button,
  DrawerBody,
} from '@chakra-ui/react';
import { EMPTY_STRING } from "../../constants";

const ExpenseAttachment = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING)

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
  }
  return (
    <>
    <Button size="xs" bgColor="header_actions"
        onClick={() => handleClick("lg")}
        key="xl"
        m={1}
        >{`Attach Receipts`}
    </Button>
    <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
            
        </DrawerHeader>                    
        <DrawerBody>
            
        </DrawerBody>
        </DrawerContent>
    </Drawer>   
    </>
  );
};

export default ExpenseAttachment;


