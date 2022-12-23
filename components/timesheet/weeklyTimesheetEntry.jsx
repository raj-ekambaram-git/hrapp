import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {EMPTY_STRING, TIMESHEET_STATUS, TIMESHEET_VALIDATION_SCHEMA, TIMESHEET_ENTRY_DEFAULT} from "../../constants/accountConstants";

import {
    HStack,
    Button,
    Box,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Card,
    CardHeader,
    CardBody,
    StackDivider,
    Grid,
    GridItem
  } from '@chakra-ui/react';
import TimesheetDateHeader from "./timesheetDateHeader";
import {
    AddIcon, DeleteIcon,ArrowBackIcon,ArrowForwardIcon
  } from '@chakra-ui/icons';  


const WeeklyTimesheetEntry = (props) => {


    const formOptions = { resolver: yupResolver(TIMESHEET_VALIDATION_SCHEMA) };
    const { register, handleSubmit, setValue, formState } = useForm(formOptions);
    const [isAddMode, setAddMode] = useState(true);
    const [timesheetEntries, setTimesheetEntries] = useState([TIMESHEET_ENTRY_DEFAULT]);
    const [showProjectError, setShowProjectError] = useState(false);

    function addTimesheeEntry(timesheetEntryCountLength) {
        console.log("addTimesheeEntry::::"+timesheetEntryCountLength);

        const inputData = [...timesheetEntries];
        inputData.push(TIMESHEET_ENTRY_DEFAULT);
        setTimesheetEntries(inputData);


    }


    function submitTimesheet(status) {
        console.log("status:::"+status);
        const inputData = [...timesheetEntries];
        for (let i = 0; i < inputData.length; i++) {
            inputData[i].status = status;
        }
        console.log("inputData inside submit time sheet:::"+JSON.stringify(inputData));
        setTimesheetEntries(inputData);
        props.data.handleTimeSheetEntries(timesheetEntries);
        props.data.onSubmit({status: status});
    }

    function setTimesheetEntry(index, inputValue, dayNumber) {
        console.log("setDayHours:::"+index+"----"+inputValue+"--dayNumber:::"+dayNumber)
        
        const inputData = [...timesheetEntries];
        let timeEntryRecord;
        console.log("inputData.length::"+inputData.length)
        //Condition when new record is updated for first time
        if(inputData.length === 0 || inputData.length <= index) {
            console.log("inside new timesheet entry record")
            timeEntryRecord = TIMESHEET_ENTRY_DEFAULT;
            console.log("inside new timesheet entry record ::newTimeEntryRecord::"+JSON.stringify(timeEntryRecord));
            inputData.push(timeEntryRecord);
        } else { //Trying to update thhe record already created
            timeEntryRecord = inputData[index];
            console.log("existingTimesheetRecord::"+JSON.stringify(timeEntryRecord));
        }

        if(dayNumber != "projectId" && timeEntryRecord.projectId === EMPTY_STRING) {
            //Error to selecct the project firsst
            setShowProjectError(true);
            return;
        }else {
            if(showProjectError) {
                setShowProjectError(false);
            }
        }
        //Validate the value entered to be 24hrs max and sum of all the rows for that day is 24hrs too
        const dayN = "day"+dayNumber;
        // if(dayNumber != "projectId" && (inputValue > 24 || enteredTotalHoursPerDay(dayNumber)+parseInt(inputValue) > 24)) {
        if(dayNumber != "projectId" && (inputValue > 24)) {            
            console.log("Hour Error happened...")
            timeEntryRecord.entries[dayN].error = true;
        }else if (dayNumber != "projectId"){
            timeEntryRecord.entries[dayN].error = false;
        }

        switch(dayNumber) {
            case "1": 
                timeEntryRecord.entries.day1.hours = inputValue;
                break;
            case "2": 
                timeEntryRecord.entries.day2.hours = inputValue;
                break;
            case "3": 
                timeEntryRecord.entries.day3.hours = inputValue;
                break;
            case "4": 
                timeEntryRecord.entries.day4.hours = inputValue;
                break;
            case "5": 
                timeEntryRecord.entries.day5.hours = inputValue;
                break;
            case "6": 
                timeEntryRecord.entries.day6.hours = inputValue;
                break;
            case "7": 
                timeEntryRecord.entries.day7.hours = inputValue;
                break;
            case "projectId":
                timeEntryRecord.projectId = parseInt(inputValue);
                break;
            default:
                console.log("default");                    
                break;
        }

        console.log("timesheetEntries UPDATED:::inputData::"+JSON.stringify(inputData));

        setTimesheetEntries(inputData);
        console.log("timesheetEntries BEFOREE:::inputData::"+JSON.stringify(inputData));
        props.data.handleTimeSheetEntries(inputData);
    }

    function enteredTotalHoursPerDay(dayNumber) {
        let timesheetTotalEntryHour = 0;
        console.log("timesheetTotalEntryHour IIIII:::"+JSON.stringify(timesheetEntries));
        const dayN = "day"+dayNumber;
        for (let i = 0; i < timesheetEntries.length; i++) {
            console.log("enteredTotalHoursPerDay[i]:::"+dayNumber+"-----"+JSON.stringify(timesheetEntries[i].entries[dayN].hours));
            if(timesheetEntries[i].entries[dayN].hours !== EMPTY_STRING) {
                timesheetTotalEntryHour = timesheetTotalEntryHour+parseInt(timesheetEntries[i].entries[dayN].hours);
            }
        }
        console.log("timesheetTotalEntryHour:::"+timesheetTotalEntryHour);
        return timesheetTotalEntryHour;
    }

    function changeTimesheetBefore(selectedDate) {
        console.log("changeTimesheetBefore")
    }

    function changeTimesheetAfter(selectedDate) {
        console.log("changeTimesheetBefore")
    }

    function deleteTimesheetEntry(removeIndex) {
        console.log("deleteTimesheetEntry:::"+removeIndex+"========")
        const inputEntriesData = [...timesheetEntries];
        console.log("inputEntriesData:::BEFORE:::"+JSON.stringify(inputEntriesData))
        inputEntriesData.splice(removeIndex, 1);

        console.log("inputEntriesData:::"+JSON.stringify(inputEntriesData));
        setTimesheetEntries(inputEntriesData);
    }
    

    return (
        <>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                    <HStack gap="16rem">
                        <Box>
                            <Heading size='sm'>Timesheet Entry</Heading>
                        </Box>
                        <Box width="timesheet.nameDropDown">
                            <HStack>
                                <ArrowBackIcon onClick={() => changeTimesheetBefore(index)}/>
                                <Heading size='sm'>Week Starting 1/1</Heading>
                                <ArrowForwardIcon onClick={() => changeTimesheetAfter(index)}/>
                            </HStack>
                        </Box>
                        <Box></Box>
                        <Box>
                            <HStack>
                                <Box>
                                    <Button className="btn" bgColor="timesheet.save" onClick={() => submitTimesheet(TIMESHEET_STATUS.Saved)}>
                                        Save
                                    </Button>
                                </Box>
                                <Box>
                                    <Button bgColor="timesheet.submit" onClick={() => submitTimesheet(TIMESHEET_STATUS.Submitted)}>
                                        {isAddMode ? (
                                            <>Submit</>
                                        ) : (
                                            <>Submit</>
                                        )}
                                    </Button>
                                </Box>
                            </HStack>
                        </Box>


                    </HStack>
                  
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />}>
                    {showProjectError ? (
                        <>
                            <Heading size='sm' color="red">Select Project First</Heading>
                        </>
                    ) : (
                        <></>
                    )}
                    <TimesheetDateHeader></TimesheetDateHeader>
                    {timesheetEntries?.map((timesheetEntry, index) => (
                        <Grid gap="3rem" marginBottom="2rem" autoRows>
                            <GridItem colSpan={2} h='10'>
                                <HStack spacing="1em">    
                                    <Box>
                                        <DeleteIcon onClick={() => deleteTimesheetEntry(index)}/>
                                    </Box>                                      

                                    <Box borderWidth="timesheet.entry_project" width="timesheet.project_drop_down">
                                        <Select id="projectId" value={timesheetEntry.projectId} onChange={(ev) => setTimesheetEntry(index, ev.target.value, "projectId")}>
                                            <option value="">Select Project</option>
                                            {props.data.userProjectList?.map((project) => (
                                                <option value={project.projectId}>{project.project.name} - {project.project.referenceCode}</option>
                                            ))}
                                        </Select>  
                                    </Box>  
                                </HStack>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6} h='10'>
                                    <HStack spacing="1em">
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day1.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day1"  value= {timesheetEntry.entries.day1.error ? "" : timesheetEntry.entries.day1.hours}  size="md" onChange={(ev) => setTimesheetEntry(index, ev.target.value,"1")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day2.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day2"  size="md" value= {timesheetEntry.entries.day2.error ? "" : timesheetEntry.entries.day2.hours}   onChange={(ev) => setTimesheetEntry(index, ev.target.value,"2")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day3.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day3"  size="md" value= {timesheetEntry.entries.day3.error ? "" : timesheetEntry.entries.day3.hours}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"3")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day4.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day4"  size="md" value= {timesheetEntry.entries.day4.error ? "" : timesheetEntry.entries.day4.hours}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"4")}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day5.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day5"  size="md" value= {timesheetEntry.entries.day5.error ? "" : timesheetEntry.entries.day5.hours}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"5")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day6.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day6"  size="md" value= {timesheetEntry.entries.day6.error ? "" : timesheetEntry.entries.day6.hours}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"6")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry" borderColor={timesheetEntry.entries.day7.error ? 'timesheet.entryError' : ""}>
                                            <Input type="number" id="day7"  size="md" value= {timesheetEntry.entries.day7.error ? "" : timesheetEntry.entries.day7.hours}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"7")}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                    </HStack>                                         
                            </GridItem>
                        </Grid>
                    ))}
                    <HStack>
                        <Box marginRight="1rem">
                        </Box>
                        <Box>
                            <Button className="btn" onClick={() => addTimesheeEntry(timesheetEntries.length)}>
                                Add Entry
                            </Button>
                        </Box>

                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
            </Stack>
        </>
    );
};

export default WeeklyTimesheetEntry;