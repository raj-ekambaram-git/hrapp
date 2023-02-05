export { ESignDetails };
import { Box, Card, CardBody, HStack, Stack } from '@chakra-ui/react'

function ESignDetails(props) {
    return (
        <>
          <HStack>
              <Card variant="document">
                  <CardBody>
                      <Stack>
                          <HStack>
                              <Box width="40%" alignContent="right">
                                  Email Subject
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.emailSubject}
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box alignContent="right">
                                  Recepient Name
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.recepientName}
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box alignContent="right">
                                  Recepient Email
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.recepientEmail}
                              </Box>                                                            
                          </HStack>
                          <HStack>
                              <Box alignContent="right">
                                  Email CC
                              </Box>
                              <Box alignContent="left">
                                  {props.emailTo.emailCC}
                              </Box>                                                            
                          </HStack>                                                                                                                                                                        
                      </Stack>
                  </CardBody>
              </Card>
          </HStack>        
        </>
    );
}
