
import React, { useState, useEffect } from "react";
import {
    HStack,
    Box,
    Heading,
    Text,
    FormControl,
    Input,
    Grid,
    GridItem
  } from '@chakra-ui/react';

const TimesheetDateHeader = (props) => {


    return(
        <>
            <Box>
            <Grid gap="24.5rem" autoRows>
                        <GridItem colSpan={2} h='10'>
                            <Box width="timesheet.entry_project_header">
                            </Box>  

                        </GridItem>
                        <GridItem colStart={3} colEnd={6} h='10'>
                        <HStack spacing="1em">
                                    <Box width="timesheet.entry_header">
                                        <Text textAlign="center" fontWeight="bold">
                                            1/1
                                        </Text>     
                                    </Box>    
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/2
                                        </Text>     
                                    </Box>  
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/3
                                        </Text>     
                                    </Box>  
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/4
                                        </Text>     
                                    </Box>  
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/5
                                        </Text>     
                                    </Box>  
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/6
                                        </Text>     
                                    </Box>  
                                    <Box width="timesheet.entry_header" fontWeight="bold">
                                        <Text textAlign="center">
                                            1/7
                                        </Text>     
                                    </Box>                                                                                                                                                                                      
                                    
                                </HStack>                                         
                        </GridItem>
                    </Grid>
            </Box>            
        </>
    );

};

export default TimesheetDateHeader;