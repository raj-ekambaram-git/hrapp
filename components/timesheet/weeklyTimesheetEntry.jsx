import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {EMPTY_STRING, MODE_ADD, TIMESHEET_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";

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
    const [timesheetEntries, setTimesheetEntries] = useState([{projectId: "", entries: {day1: "", day2: "",day3: "",day4: "",day5: "",day6: "",day7: ""}}]);
    const [showProjectError, setShowProjectError] = useState(false);

    function addTimesheeEntry(timesheetEntryCountLength) {
        console.log("addTimesheeEntry::::"+timesheetEntryCountLength);

        const inputData = [...timesheetEntries];
        inputData.push({projectId: "", entries: {day1: "", day2: "",day3: "",day4: "",day5: "",day6: "",day7: ""}});
        setTimesheetEntries(inputData);


    }

    function setTimesheetEntry(index, inputValue, dayNumber) {
        console.log("setDayHours:::"+index+"----"+inputValue+"--dayNumber:::"+dayNumber)
        
        const inputData = [...timesheetEntries];
        let timeEntryRecord;
        console.log("inputData.length::"+inputData.length)
        //Condition when new record is updated for first time
        if(inputData.length === 0 || inputData.length <= index) {
            console.log("inside new timesheet entry record")
            timeEntryRecord = {projectId: "", entries: {day1: "", day2: "",day3: "",day4: "",day5: "",day6: "",day7: ""}};
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

        switch(dayNumber) {
            case "1": 
                timeEntryRecord.entries.day1 = inputValue;
                break;
            case "2": 
                timeEntryRecord.entries.day2 = inputValue;
                break;
            case "3": 
                timeEntryRecord.entries.day3 = inputValue;
                break;
            case "4": 
                timeEntryRecord.entries.day4 = inputValue;
                break;
            case "5": 
                timeEntryRecord.entries.day5 = inputValue;
                break;
            case "6": 
                timeEntryRecord.entries.day6 = inputValue;
                break;
            case "7": 
                timeEntryRecord.entries.day7 = inputValue;
                break;
            case "projectId":
                timeEntryRecord.projectId = inputValue;
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
                                    <Button className="btn" onClick={""} bgColor="timesheet.save">
                                        Save
                                    </Button>
                                </Box>
                                <Box>
                                    <Button type="submit" bgColor="timesheet.submit">
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
                                        {index}---<DeleteIcon onClick={() => deleteTimesheetEntry(index)}/>
                                    </Box>                                      

                                    <Box borderWidth="timesheet.entry_project" width="timesheet.project_drop_down">
                                        <Select id="projectId" value={timesheetEntry.projectId} onChange={(ev) => setTimesheetEntry(index, ev.target.value, "projectId")}>
                                            <option value="">Select Project</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Error">Error</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </Select>  
                                    </Box>  
                                </HStack>
                            </GridItem>
                            <GridItem colStart={3} colEnd={6} h='10'>
                                    <HStack spacing="1em">
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day1"  value={timesheetEntry.entries.day1}  size="md" onChange={(ev) => setTimesheetEntry(index, ev.target.value,"1")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day2"  size="md" value={timesheetEntry.entries.day2}  onChange={(ev) => setTimesheetEntry(index, ev.target.value,"2")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day3"  size="md" value={timesheetEntry.entries.day3} onChange={(ev) => setTimesheetEntry(index, ev.target.value,"3")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day4"  size="md" value={timesheetEntry.entries.day4} onChange={(ev) => setTimesheetEntry(index, ev.target.value,"4")}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day5"  size="md" value={timesheetEntry.entries.day5} onChange={(ev) => setTimesheetEntry(index, ev.target.value,"5")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day6"  size="md" value={timesheetEntry.entries.day6} onChange={(ev) => setTimesheetEntry(index, ev.target.value,"6")} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day7"  size="md" value={timesheetEntry.entries.day7} onChange={(ev) => setTimesheetEntry(index, ev.target.value,"7")}  boxSize="timesheet.entry.input"/>
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