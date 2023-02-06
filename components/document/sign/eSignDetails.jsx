export { ESignDetails };
import { Box, Card, CardBody, HStack, Stack } from '@chakra-ui/react'
import { ESignEmailTos } from './eSignEmailTos';

function ESignDetails(props) {
    return (
        <>
          <HStack>
              <Card variant="document" width="100%">
                  <CardBody>
                      <Stack>
                          <HStack>
                            <ESignEmailTos edit={true} emailTo={props.emailTo} setEmailTo={props.setEmailTo}/>
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Email Subject
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.emailSubject}
                              </Box>                                                            
                          </HStack>
                          {/* <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Recepient Name
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.recepientName}
                              </Box>                                                            
                          </HStack> */}
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Recepient
                              </Box>
                              <Box alignContent="left" width="75%">
                                  {props.emailTo?.recepientEmail?.map((recepient) => 
                                    <Stack>
                                        <HStack>
                                            <Box textAlign="right" fontWeight="600">
                                                Name
                                            </Box>
                                            <Box width="30%">{recepient.name}</Box>                                           
                                            <Box textAlign="right" fontWeight="600">
                                                Email
                                            </Box>
                                            <Box>{recepient.email}</Box>                                                                                
                                        </HStack>                                      
                                    </Stack>                                                                        
                                  )}                                  
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  CC
                              </Box>
                              <Box alignContent="left"   width="75%">
                                  {props.emailTo?.ccEmail?.map((cc) => 
                                    <Stack>
                                        <HStack>
                                            <Box textAlign="right"  fontWeight="600">
                                                Name
                                            </Box>
                                            <Box width="30%">{cc.name}</Box>                                           
                                            <Box textAlign="right" fontWeight="600">
                                                Email
                                            </Box>
                                            <Box>{cc.email}</Box>                                                                                
                                        </HStack>    
                                    </Stack>                                    
                                  )}
                              </Box>                                                            
                          </HStack>                                                                                                                                                                        
                      </Stack>
                  </CardBody>
              </Card>
          </HStack>        
        </>
    );
}
