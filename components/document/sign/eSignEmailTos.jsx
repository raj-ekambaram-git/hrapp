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
    Button,
  } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { EMPTY_STRING } from '../../../constants';
import { util } from '../../../helpers/util';

function ESignEmailTos(props) {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [emailSubject, setEmailSubject] = useState();
  const [recepientName, setRecepientName] = useState();
  const [recepientEmail, setRecepientEmail] = useState();
  const [emailCC, setEmailCC] = useState();

  const handleDocumentSignature = (newSize,isDocumentSignatureSelected) => {
    if(isDocumentSignatureSelected) {
      props.handleDocumentSignature(isDocumentSignatureSelected)
      setSize(newSize)
      onOpen()  
    } else {
      onClose()
    }
  }

  const handleEmailCC = (emailCCValue) => {
    setEmailCC(emailCCValue)
  }


  const addSignatureDetails = () => {
    console.log("emailSubject::"+emailSubject+"*****recepientName::"+recepientName+"****recepientEmail::"+recepientEmail+"****emailCC::"+emailCC)
    if(emailSubject && recepientName && recepientEmail && util.isValidEmail(recepientEmail) && emailCC && util.isValidEmail(emailCC)) {
      const eSignEmailDetails = {
        emailSubject: emailSubject,
        recepientName: recepientName,
        recepientEmail: recepientEmail,
        emailCC: emailCC
      }
      console.log("eSignEmailDetails:::"+JSON.stringify(eSignEmailDetails))
      props.setEmailTo(eSignEmailDetails)
      onClose()
    }else {
      toast({
        title: 'eSignature Details.',
        description: 'All the fields are required, please enter and try again.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
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
                                              <Input type="text" onChange={(e) => setEmailSubject(e.target.value)} />
                                            </Box>
                                            
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient Name </Box>
                                            <Box alignContent="left">
                                              <Input type="text" onChange={(e) => setRecepientName(e.target.value)} />
                                            </Box>                                            
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient Email </Box>
                                            <Box alignContent="left">
                                              <Input type="email" onChange={(e) => setRecepientEmail(e.target.value)} />
                                            </Box>
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Email CC</Box>
                                            <Box alignContent="left">
                                              <Input type="email" onChange={(e) => handleEmailCC(e.target.value)} />
                                            </Box>
                                        </HStack>
                                    </Stack>
                                  </CardBody>
                                  <CardFooter>
                                    <HStack>
                                    <Button size="xs" colorScheme="yellow" onClick={onClose}>
                                          Cancel
                                      </Button>                                      
                                      <Button size="xs" colorScheme='red' onClick={addSignatureDetails}>
                                          Add Signature Details
                                      </Button>
                                    </HStack>
                                  </CardFooter>
                              </Card>

                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  
        </>
    );
}
