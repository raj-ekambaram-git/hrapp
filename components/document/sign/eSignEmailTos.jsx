export { ESignEmailTos };
import {
    Box,
    Stack,
    Checkbox,
    HStack,
    useDisclosure,
    useToast,
    Input,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    CardBody,
    Card,
    CardFooter,
  } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { EMPTY_STRING } from '../../../constants';

function ESignEmailTos(props) {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [emailSubject, setEmailSubject] = useState();

  const handleDocumentSignature = (newSize,isDocumentSignatureSelected) => {
    if(isDocumentSignatureSelected) {
      props.handleDocumentSignature(isDocumentSignatureSelected)
      setSize(newSize)
      onOpen()  
    } else {
      onClose()
    }
  }
    return (
        <>
          <Checkbox
              onChange={(e) => handleDocumentSignature("lg",e.target.checked) }
          />   
          <Drawer onClose={onClose} isOpen={isOpen} size="lg">
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Send eSignatures To
                            </DrawerHeader>
                            <DrawerBody>
                              <Card variant="eSignDocument">
                                  <CardBody>
                                    <Stack spacing={3}>     
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right" width="25%">Email Subject </Box>
                                            <Box alignContent="left">
                                              <Input type="text" onChange={(e) => setEmailSubject(e)} />
                                            </Box>
                                            
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient Name </Box>
                                            <Box alignContent="left">
                                              <Input type="text" onChange={(e) => setEmailSubject(e)} />
                                            </Box>                                            
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient Email </Box>
                                            <Box alignContent="left">
                                              <Input type="email" onChange={(e) => setEmailSubject(e)} />
                                            </Box>
                                        </HStack>
                                    </Stack>
                                  </CardBody>
                                  <CardFooter>

                                  </CardFooter>
                              </Card>

                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  
        </>
    );
}
