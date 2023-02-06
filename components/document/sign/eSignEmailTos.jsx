export { ESignEmailTos };
  import { SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons';
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
  const [recepientEmail, setRecepientEmail] = useState([{}]);
  const [ccEmail, setCcEmail] = useState([{}]);

  const handleDocumentSignature = (newSize,isDocumentSignatureSelected) => {
    if(isDocumentSignatureSelected) {
      props.handleDocumentSignature(isDocumentSignatureSelected)
      setSize(newSize)
      onOpen()  
    } else {
      onClose()
      props.setEmailTo(null)
      setEmailSubject(null)
      setRecepientName(null)
      setRecepientEmail(null)
      setCcEmail(null)
      
    }
  }

  const handleEmailCC = (emailCCValue, index) => {
    if(util.isValidEmail(emailCCValue)) {
      if(ccEmail.includes(emailCCValue)) {
        toast({
          title: 'eSignature Error.',
          description: 'Email CC is already added, please enter unique email.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }else {
        const newEmailCC = [...ccEmail]
        newEmailCC[index]["email"]=emailCCValue
        setCcEmail(newEmailCC)    
      }
    }
  }

  const handleNameCC = (nameCCValue, index) => {
        const newNameCC = [...ccEmail]
        console.log(" newNameCC[index]::"+ JSON.stringify(newNameCC[index]))
        newNameCC[index]["name"]= nameCCValue
        setCcEmail(newNameCC)    
  }  

  const handleRecepientName= (recepeintNameValue, index) => {
    const newRecepientName = [...recepientEmail]
    newRecepientName[index]["name"]=recepeintNameValue
    setRecepientEmail(newRecepientName)    
}  
  const handleRecepientEmail = (recepeintEmailValue, index) => {
    if(util.isValidEmail(recepeintEmailValue)) {
      if(recepientEmail.includes(recepeintEmailValue)) {
        toast({
          title: 'eSignature Error.',
          description: 'Recepient Email is already added, please enter unique email.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }else {
        const newRecepeintEmail = [...recepientEmail]
        newRecepeintEmail[index]["email"]=recepeintEmailValue
        setRecepientEmail(newRecepeintEmail)            
      }
    }
  }

  const handleEditeSignDetails = (newSize) => {
    console.log("props.emailTo:::"+JSON.stringify(props.emailTo))
    if(props.emailTo) {
      setEmailSubject(props.emailTo.emailSubject)
      // setRecepientName(props.emailTo.recepientName)
      setRecepientEmail(props.emailTo.recepientEmail)
      setCcEmail(props.emailTo.ccEmail)
    }
    setSize(newSize)
    onOpen()  

  }
  

  const handleRemoveRow = (inputType, index) => {
    if(inputType === "ccEmail") {
      const newCCEmail = [...ccEmail];
      newCCEmail.splice(index, 1);
      setCcEmail(newCCEmail)
    }
    if(inputType === "recepientEmail") {
      const newRecepientEmail = [...recepientEmail];
      newRecepientEmail.splice(index, 1);
      setRecepientEmail(newRecepientEmail)
    }

  }

  const handleAddExtraRow = (inputType) => {
    if(inputType === "ccEmail") {
      const newccEmail = [...ccEmail]
      newccEmail.push({})
      setCcEmail(newccEmail)

    }
    if(inputType === "recepientEmail") {
      const newRecepeintEmail = [...recepientEmail]
      newRecepeintEmail.push({})
      setRecepientEmail(newRecepeintEmail)
    }

  }
  const addSignatureDetails = () => {

    console.log("ccEmail::::"+JSON.stringify(ccEmail)+"*******recepientEmailLL"+JSON.stringify(recepientEmail))

    if(emailSubject && recepientEmail && ccEmail && !util.validateEmailArray(ccEmail) && !util.validateEmailArray(recepientEmail)) {
      const eSignEmailDetails = {
        emailSubject: emailSubject,
        recepientEmail: recepientEmail,
        ccEmail: ccEmail
      }
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
        {props.edit?<>
          <Button size="xs" bgColor="header_actions" onClick={() => handleEditeSignDetails("lg")}>
              Edit
          </Button>           
        </>:<>
          <Checkbox
                onChange={(e) => handleDocumentSignature("lg",e.target.checked) }
            />   
        </>}
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
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
                                              <Input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                                            </Box>
                                            
                                        </HStack>
                                        {/* <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient Name </Box>
                                            <Box alignContent="left">
                                              <Input type="text" value={recepientName} onChange={(e) => setRecepientName(e.target.value)} />
                                            </Box>                                            
                                        </HStack> */}
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">Recepient </Box>
                                            <Box alignContent="left">
                                              {recepientEmail.map((recepient, index) => 
                                                <HStack>
                                                    <Input type="text" placeholder='Recepient Name' marginTop={2} onChange={(e) => handleRecepientName(e.target.value, index)}  marginBottom={2}/>
                                                    <Input type="email" placeholder='Recepient Email' onChange={(e) => handleRecepientEmail(e.target.value, index)}  marginBottom={2}/>
                                                    {index === 0?<>
                                                      <SmallAddIcon onClick={() => handleAddExtraRow("recepientEmail")}/>
                                                    </>:<>
                                                      <SmallCloseIcon onClick={() => handleRemoveRow("recepientEmail", index)}/>
                                                    </>}
                                                    
                                                </HStack>                                                
                                              )}                                                         
                                            </Box>
                                        </HStack>
                                        <HStack spacing={7}>
                                            <Box fontWeight="500" alignContent="right"  width="25%">CC</Box>
                                            <Box alignContent="left">                
                                            {ccEmail?.map((cc, index) => 
                                                  <HStack>
                                                    <Input type="text" placeholder='CC Name' marginTop={2} onChange={(e) => handleNameCC(e.target.value, index)} marginBottom={2}/> 
                                                    <Input type="email" placeholder='CC Email' onChange={(e) => handleEmailCC(e.target.value, index)} marginBottom={2}/> 
                                                    {index === 0?<>
                                                      <SmallAddIcon onClick={() => handleAddExtraRow("ccEmail")}/>
                                                    </>:<>
                                                      <SmallCloseIcon onClick={() => handleRemoveRow("ccEmail", index)}/>
                                                    </>}
                                                  </HStack> 
                                            )}                    
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
