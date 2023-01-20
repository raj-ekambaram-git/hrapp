import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    useDisclosure,
    DrawerBody,
    Stack,
    StackDivider,
    Box,
    Card,
    CardBody,
    Divider,
    Textarea,
    Button,
    Text
  } from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
  



  const TimesheetDailyEntryNotes = (props) => {
    const dispatch = useDispatch();

    const [size, setSize] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const tsEntries = useSelector(state => state.timesheet.timesheetEntries);

    useEffect(() => {
      }, []);

      const handleClick = (newSize) => {
        setSize(newSize)
        onOpen()
    }      


    return (
        <div>
                <Box>
                <Button size="xs" bgColor="table_tile" onClick={() => handleClick("lg")}>
                        Notes <Text color="red">{props.dailyNotesRequired?"*":""}</Text>
                </Button>

                </Box>
                <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                    <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                                <DrawerHeader>
                                    Daily Notes for {props.projectName}
                                </DrawerHeader>
                                <DrawerBody>
                                <Stack divider={<StackDivider />} spacing='1'>
                                    {props.weekCalendar?.day1 != undefined ? (
                                        <>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day1?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day2?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day3?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day4?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day5?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day6?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea isRequired border='1px' placeholder={"Add "+props.weekCalendar?.day7?.date?.substring(5,10).replace("-","/")+" Notes"}  maxH="40%"/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>

                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )}                                        
                                </Stack>
                                </DrawerBody>
                        </DrawerContent>                    
                </Drawer>            
        </div>
    );
};


export default TimesheetDailyEntryNotes;