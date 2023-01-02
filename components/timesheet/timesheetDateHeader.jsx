
import React, { useState, useEffect } from "react";
import {
    HStack,
    Box,
    Text,
    Grid, 
    GridItem
  } from '@chakra-ui/react';

const TimesheetDateHeader = (props) => {

    console.log("PROPPPPPSSS::"+JSON.stringify(props));
    const calendarData = props.data;

    return(
        <>
            <Box>
            <Grid gap="21rem" autoRows>
                        <GridItem colSpan={2} h='10'>
                            <Box width="timesheet.entry_project_header">
                            </Box>  

                        </GridItem>
                        <GridItem colStart={3} colEnd={6} h='10'>
                            {calendarData.day1 != undefined ? (
                                <>
                                    <HStack spacing="2rem">
                                        <HStack spacing="2em">
                                            <Box width="timesheet.entry_header">
                                                <Text textAlign="center" fontWeight="bold">
                                                    {calendarData.day1.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>    
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day2.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>  
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day3.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>  
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day4.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>  
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day5.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>  
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day6.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>  
                                            <Box width="timesheet.entry_header" fontWeight="bold">
                                                <Text textAlign="center">
                                                    {calendarData.day7.date.substring(5,10).replace("-","/")}
                                                </Text>     
                                            </Box>                                                                                                                                                                                      
                                        </HStack>     

                                        <Box width="timesheet.entry_header" fontWeight="bold">
                                            <Text textAlign="center">
                                                Status
                                            </Text>     
                                        </Box>  
                                    </HStack>                                    
                                                                     
                                </>
                            ) : (
                                <>
                                fsgsg
                                </>
                            )}
                                   
                        </GridItem>
                    </Grid>
            </Box>            
        </>
    );

};

export default TimesheetDateHeader;