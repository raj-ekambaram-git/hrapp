export { ESignViewDocument };
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
    CardHeader,
    Spinner,
  } from '@chakra-ui/react'
  
import { useRef, useState } from 'react';
import { EMPTY_STRING } from '../../../constants';
import { util } from '../../../helpers/util';
import { documentService, userService } from '../../../services';

function ESignViewDocument(props) {
  const toast = useToast();
  const [size, setSize] = useState(EMPTY_STRING);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [envelopeeDocuments, setEnvelopeeDocuments] = useState();
  const [recepients, setRecepients] = useState();
  const [loading, setLoading] = useState(false);

  const handleeESignViewDocument = async (newSize) => {
    setSize(newSize)
    onOpen()  
    setLoading(true)
    const responseData = await documentService.getEnvelopeAttachments(props.envelopeId, userService.getAccountDetails().accountId)
    setLoading(false)
    if(responseData.error) {
      toast({
        title: 'View eSignature Document.',
        description: 'Error getting eSignature document, please try again. Details:'+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
    })
    return;
    }else {
      setEnvelopeeDocuments(responseData.envelopeDocuments)
      setRecepients(responseData.recepients)
    }
    
  }

  const handleViewDocument = async(documentId) => {
    if(documentId && props.envelopeId) {
      setLoading(true)
      const responseData = await documentService.getEnvelopeDocument(props.envelopeId,documentId, userService.getAccountDetails().accountId)
      setLoading(false)
      // console.log("responseData::"+JSON.stringify(responseData))
      if(!responseData.error) {

      }
      // window.open(responseData);
      // console.log("HANDLE VIEW DOC::"+JSON.stringify(responseData))
    }
    
  }


    return (
        <>
          <Button size="xs" bgColor="header_actions" onClick={() => handleeESignViewDocument("lg")}>
              eSign Document
          </Button>           
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                eSign Document for {props.documentName}
                            </DrawerHeader>
                            <DrawerBody>
                              {loading? (
                                <>
                                <Spinner/>
                                </>
                              ) : (<></>)}          

                              <Card variant="eSignDocument">
                                <CardHeader>
                                    Recepients
                                </CardHeader>
                                <CardBody>
                                  <Stack>
                                    <Card>
                                      <CardBody>
                                        <Box fontWeight="600" marginBottom={4}>
                                          Signer(s)
                                        </Box>
                                        {recepients?.signers.map((signer) => 
                                            <HStack>
                                                <Box textAlign="right" fontWeight="600">
                                                    Name
                                                </Box>
                                                <Box width="30%">{signer.name}</Box>                                           
                                                <Box textAlign="right" fontWeight="600">
                                                    Email
                                                </Box>
                                                <Box>{signer.email}</Box>                                                                                
                                            </HStack>   
                                        )}
                                      </CardBody>
                                    </Card>
                                    <Card>
                                      <CardBody>
                                        <Box fontWeight="600" marginBottom={4}>
                                          CC(s)
                                        </Box>
                                        {recepients?.cc.map((cc) => 
                                            <HStack>
                                                <Box textAlign="right" fontWeight="600">
                                                    Name
                                                </Box>
                                                <Box width="30%">{cc.name}</Box>                                           
                                                <Box textAlign="right" fontWeight="600">
                                                    Email
                                                </Box>
                                                <Box>{cc.email}</Box>                                                                                
                                            </HStack>   
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Stack>
                                </CardBody>
                              </Card>
                              <Card variant="eSignDocument">
                                <CardHeader>
                                    Documents
                                </CardHeader>
                                <CardBody>
                                  <Stack>
                                    <Card>
                                      <CardBody>
                                        <Box fontWeight="600" marginBottom={4}>
                                          Document(s)
                                        </Box>
                                        {envelopeeDocuments?.envelopeDocuments?.map((document) => 
                                            <HStack marginBottom={4}>
                                                <Box textAlign="right" fontWeight="600">
                                                    Name
                                                </Box>
                                                <Box >{document.name}</Box>      
                                                <Button size="xs" bgColor="header_actions" onClick={() => handleViewDocument(document.documentId)}>View/Download</Button>                                                                                          
                                            </HStack>   
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Stack>
                                </CardBody>
                              </Card>                              
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  
        </>
    );
}
