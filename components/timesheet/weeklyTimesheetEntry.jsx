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
  


const WeeklyTimesheetEntry = (props) => {


    const formOptions = { resolver: yupResolver(TIMESHEET_VALIDATION_SCHEMA) };
    const { register, handleSubmit, setValue, formState } = useForm(formOptions);
    const [isAddMode, setAddMode] = useState(true);


    return (
        <>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Timesheet Entry</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />}>
                    <TimesheetDateHeader></TimesheetDateHeader>
                    <Grid gap="3rem" marginBottom="2rem" autoRows>
                        <GridItem colSpan={2} h='10'>
                            <Box borderWidth="timesheet.entry_project" width="timesheet.project_drop_down">
                                <Select id="projectId" {...register('projectId')}>
                                    <option value="">Select Project</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Error">Error</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </Select>  
                            </Box>  

                        </GridItem>
                        <GridItem colStart={3} colEnd={6} h='10'>
                        <HStack spacing="1em">
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day1"  size="md" {...register('day1')} boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day2"  size="md" {...register('day2')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day3"  size="md" {...register('day3')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day4"  size="md" {...register('day4')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day5"  size="md" {...register('day5')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day6"  size="md" {...register('day6')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day7"  size="md" {...register('day7')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    
                                </HStack>                                         
                        </GridItem>
                    </Grid>

                    {/* <Box>
                        <HStack spacing="7rem">
                            <Box borderWidth="timesheet.entry_project">
                                <Select id="projectId" {...register('projectId')} width="timesheet.project_drop_down">
                                    <option value="">Select Project</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Error">Error</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </Select>  
                            </Box>  
                            <Box>
                                <HStack spacing="1em">
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day1"  size="md" {...register('day1')} boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day2"  size="md" {...register('day2')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day3"  size="md" {...register('day3')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day4"  size="md" {...register('day4')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day5"  size="md" {...register('day5')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day6"  size="md" {...register('day6')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    <Box borderWidth="timesheet.entry">
                                    <FormControl>
                                        <Input type="text" id="day7"  size="md" {...register('day7')}  boxSize="timesheet.entry.input"/>
                                    </FormControl>     
                                    </Box>    
                                    
                                </HStack>
                            </Box>  
                        </HStack>     
                    </Box>                      */}
                  </Stack>
                </CardBody>
              </Card>              
            
                <Flex marginBottom={4}>
                    <HStack>
                    <Box>
                    <Button className="btn" onClick={""}>
                        Discard
                        </Button>
                    </Box>
                    <Box>
                        <Button type="submit">
                        {isAddMode ? (
                            <>Add New Vendor</>
                        ) : (
                            <>Update Vendor</>
                        )}
                        </Button>
                    </Box>
                    </HStack>
                </Flex>                   
            </Stack>
        </>
    );
};

export default WeeklyTimesheetEntry;