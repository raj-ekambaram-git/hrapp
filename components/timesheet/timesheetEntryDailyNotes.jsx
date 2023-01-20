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
import { setTSEntries } from "../../store/modules/Timesheet/actions";
  



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


    function setTimesheetEntryDailyNotes(ev, dayNumber) {
        const inputValue = ev.target.value;
        const inputData = [...tsEntries];
        const timeEntryRecord = inputData[props.index];


        //Validate the value entered to be 24hrs max and sum of all the rows for that day is 24hrs too
        const dayN = "day"+dayNumber;
        switch(dayNumber) {
            case "1": 
                timeEntryRecord.entries.day1.notes = inputValue;
                break;
            case "2": 
                timeEntryRecord.entries.day2.notes = inputValue;
                break;
            case "3": 
                timeEntryRecord.entries.day3.notes = inputValue;
                break;
            case "4": 
                timeEntryRecord.entries.day4.notes = inputValue;
                break;
            case "5": 
                timeEntryRecord.entries.day5.notes = inputValue;
                break;
            case "6": 
                timeEntryRecord.entries.day6.notes = inputValue;
                break;
            case "7": 
                timeEntryRecord.entries.day7.notes = inputValue;
                break;
            default:
                console.log("default");                    
                break;
        }

        dispatch(setTSEntries(inputData));
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
                                                <Textarea maxLength={50} isRequired border='1px' value={tsEntries[props.index]?.entries?.day1?.notes} placeholder={"Add "+props.weekCalendar?.day1?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"1")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea maxLength={50} isRequired border='1px' value={tsEntries[props.index]?.entries?.day2?.notes} placeholder={"Add "+props.weekCalendar?.day2?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"2")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea imaxLength={50} sRequired border='1px' value={tsEntries[props.index]?.entries?.day3?.notes} placeholder={"Add "+props.weekCalendar?.day3?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"3")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea maxLength={50} isRequired border='1px' value={tsEntries[props.index]?.entries?.day4?.notes} placeholder={"Add "+props.weekCalendar?.day4?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"4")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea maxLength={50} isRequired border='1px' value={tsEntries[props.index]?.entries?.day5?.notes} placeholder={"Add "+props.weekCalendar?.day5?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"5")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea maxLength={50} isRequired border='1px' value={tsEntries[props.index]?.entries?.day6?.notes} placeholder={"Add "+props.weekCalendar?.day6?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"6")}/>       
                                            </CardBody>
                                            <Divider/>
                                        </Card>
                                        <Card variant="timesheetDailyNotes"> 
                                            <CardBody>
                                            <Textarea maxLength={50} sRequired border='1px' value={tsEntries[props.index]?.entries?.day7?.notes} placeholder={"Add "+props.weekCalendar?.day7?.date?.substring(5,10).replace("-","/")+" Notes (max 50 characters)"}  maxH="40%" onChange={(ev) => setTimesheetEntryDailyNotes(ev,"7")}/>       
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