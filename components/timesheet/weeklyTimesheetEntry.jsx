import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {MODE_ADD, TIMESHEET_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";
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
    AddIcon, DeleteIcon
  } from '@chakra-ui/icons';  


const WeeklyTimesheetEntry = (props) => {


    const formOptions = { resolver: yupResolver(TIMESHEET_VALIDATION_SCHEMA) };
    const { register, handleSubmit, setValue, formState } = useForm(formOptions);
    const [isAddMode, setAddMode] = useState(true);
    const [timesheetEntryCount, setTimesheetEntryCount] = useState([1]);

    function addTimesheeEntry(timesheetEntryCountLength) {
        console.log("addTimesheeEntry::::"+timesheetEntryCountLength);

        const inputData = [...timesheetEntryCount];
        inputData.push(timesheetEntryCountLength+1);
        setTimesheetEntryCount(inputData);


    }

    function deleteTimesheetEntry(removeIndex) {
        console.log("deleteTimesheetEntry:::")
        const inputData = [...timesheetEntryCount];
        inputData.splice(removeIndex, 1);
        setTimesheetEntryCount(inputData);
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
                        <Box bgColor="timesheet.nameDropDown" width="timesheet.nameDropDown">
                            <Select id="name" {...register('name')}>
                                <option value="">Timesheet Week Ending 1/1</option>
                                <option value="">Timesheet Week Ending 1/1</option>
                                <option value="">Timesheet Week Ending 1/1</option>
                                <option value="">Timesheet Week Ending 1/1</option>
                                <option value="">Timesheet Week Ending 1/1</option>
                            </Select>  
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
                    <TimesheetDateHeader></TimesheetDateHeader>
                    {timesheetEntryCount?.map((count, index) => (
                        <Grid gap="3rem" marginBottom="2rem" autoRows>
                            <GridItem colSpan={2} h='10'>
                                <HStack spacing="1em">    
                                    <Box>
                                        <DeleteIcon onClick={() => deleteTimesheetEntry(index)}/>
                                    </Box>                                      

                                    <Box borderWidth="timesheet.entry_project" width="timesheet.project_drop_down">
                                        <Select id="projectId" {...register('projectId')}>
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
                                            <Input type="text" id="day1"  size="md" {...register('day1')} boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day2"  size="md" {...register('day2')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day3"  size="md" {...register('day3')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day4"  size="md" {...register('day4')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day5"  size="md" {...register('day5')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day6"  size="md" {...register('day6')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                        <Box borderWidth="timesheet.entry">
                                            <Input type="text" id="day7"  size="md" {...register('day7')}  boxSize="timesheet.entry.input"/>
                                        </Box>    
                                    </HStack>                                         
                            </GridItem>
                        </Grid>
                    ))}
                    <HStack>
                        <Box marginRight="1rem">
                        </Box>
                        <Box>
                            <Button className="btn" onClick={() => addTimesheeEntry(timesheetEntryCount.length)}>
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