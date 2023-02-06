export { ESignDetails };
import { Box, Card, CardBody, HStack, Stack } from '@chakra-ui/react'
import { ESignEmailTos } from './eSignEmailTos';

function ESignDetails(props) {
    return (
        <>
          <HStack>
              <Card variant="document" width="75%">
                  <CardBody>
                      <Stack>
                          <HStack>
                            <ESignEmailTos edit={true} emailTo={props.emailTo}/>
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Email Subject
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.emailSubject}
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Recepient Name
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.recepientName}
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  Recepient Email
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo?.recepientEmail?.map((recepient) => 
                                    <Stack>
                                      <Box>{recepient}</Box>
                                    </Stack>                                                                        
                                  )}                                  
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box width="25%" textAlign="right" fontWeight="600">
                                  CC Email
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo?.ccEmail?.map((cc) => 
                                    <Stack>
                                      <Box>{cc}</Box>
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
