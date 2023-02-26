import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Stack,
    HStack,
    useToast,
    Input,
    Card,
    CardBody,
    CardFooter,
    Select,
    CardHeader,
    FormControl,
    FormLabel,
    Checkbox
  } from '@chakra-ui/react';
import { CommonConstants, ConfigConstants, EMPTY_STRING, ScheduleJobConstants } from "../../../constants";
import { importExportService, schedulerService, userService } from "../../../services";
import { util } from "../../../helpers";
import DatePicker from "../../common/datePicker";
import { Spinner } from '../../common/spinner'


const AddEditJob = (props) => {
    const toast = useToast();
    const [enableAddNew, setEnableAddNew] = useState(false);
    const [enableRecurring, setEnableRecurring] = useState(false);
    const [recurringInterval, setRecurringInterval] = useState();
    const [scheduleDate, setScheduleDate] = useState();
    const [scheduleHour, setScheduleHour] = useState();
    const [scheduleMinute, setScheduleMinute] = useState();
    const [templates, setTemplates] = useState();
    const [typeName, setTypeName] = useState();
    const [type, setType] = useState();
    const [name, setName] = useState();
    const [loading, setLoading] = useState();


    useEffect(() => {
        resetValues()
    }, []);

    const resetValues = () => {
        setLoading(false)
        setType(null)
        setName(null)
        setRecurringInterval(null)
        setEnableRecurring(false)
    }

    const handleAddJob = async() => {
        setLoading(true)
        const responseData = await importExportService.getSavedExportTemplates(userService.getAccountDetails().accountId)
        setTemplates(responseData)
        setEnableAddNew(true)
        setLoading(false)
    }

    const handleSaveJob =  async() => {        
        const formFields = [{key: "Job Name", value: name}, {key:"Job Type", value: type}, {key:"Schedule Date", value: scheduleDate}, {key:"Schedule Hour", value: scheduleHour}, {key:"Schedule Minute", value: scheduleMinute} ];
        if(!util.formFieldValidation("Add Schedule Job", formFields, toast )) {

            let cronExpression = EMPTY_STRING;
            if(enableRecurring) {
                if(recurringInterval && recurringInterval != EMPTY_STRING) {
                    cronExpression = util.getCronExpression(scheduleDate, scheduleHour, scheduleMinute, recurringInterval)
                } else {
                    toast({
                        title: "Add Schedule Job",
                        description: 'Recurring interval is required field, please try again.',
                        status: 'error',
                        position: 'top',
                        duration: 6000,
                        isClosable: true,
                    })
                }
                
            }
            


            const jobDataRequest = {
                "jobRequestData": {
                  "accountId": userService.getAccountDetails().accountId,
                  "cronExpression": cronExpression,
                  "jobGroup": userService.getAccountDetails().accountId.toString(),
                  "name": name,
                  "templateId": type,
                  "templateName": typeName,
                  "templateParams": [
                  ],
                  "userId": userService.userValue.id
                },
                "scheduleTime": {
                  "scheduledTime": new Date(scheduleDate.setHours(scheduleHour, scheduleMinute, 0,0)),
                  "zoneId": ConfigConstants.TIMEZONE
                }
              }

            const responseData = await schedulerService.scheduleJob(jobDataRequest, userService.getAccountDetails().accountId)
            if(responseData.error) {
                toast({
                    title: "Add Schedule Job",
                    description: 'Error schedule new job. Please try again later or contact administrator. Details:'+responseData.errorMessage,
                    status: 'error',
                    position: 'top',
                    duration: 6000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Add Schedule Job",
                    description: 'Successfully scheduled new job.',
                    status: 'success',
                    position: 'top',
                    duration: 6000,
                    isClosable: true,
                })
                props.onClose()
            }

        } 

    }

    const handleScheduleDate = (e) => {
        if(e != undefined && (e.updatedDate)) {
            if(util.getFormattedDate(scheduleDate) != util.getFormattedDate(e.date)) {
                setScheduleDate(e.date)
            }      
          }
    }

    const handleType =(ev) => {
        setType(ev.target.value)
        setTypeName(ev.target.options.item(ev.target.selectedIndex).getAttribute("data-templateName"))
    }



    return (
        <>
        <Stack spacing={5} marginBottom={6}>
            {loading? (
                  <>
                  <Spinner/>
                  </>
                ) : (<></>)}
                {enableAddNew?<>
                    <Card variant="scheduleJobForm">
                        <CardHeader>
                            Add New Job
                        </CardHeader>
                        <CardBody>
                            <Stack spacing={5}>
                                <HStack spacing={9}>
                                        <FormControl isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <Input type="text" width="75%" value={name} id="name"  onChange={(ev) => setName(ev.target.value)}></Input>
                                        </FormControl> 
                                        <FormControl isRequired>
                                            <FormLabel>Type</FormLabel>
                                            <Select  id="type" width="50%" value={type} onChange={(ev) => handleType(ev)}>
                                                <option value="">Select Type</option>
                                                {templates?.map((template) => (
                                                    <option value={template.id} 
                                                            data-queryMeta={template.queryMeta}
                                                            data-templateName={template.name}
                                                            data-templateType={template.type} >{template.name}</option>
                                                ))}
                                            </Select>
                                        </FormControl>     
                                </HStack>
                                <HStack spacing={9}>
                                    <FormControl isRequired>
                                        <FormLabel>Recurring?</FormLabel>
                                        <Checkbox onChange={(e) => setEnableRecurring(e.target.checked)} />
                                    </FormControl> 
                                    {enableRecurring?<>
                                        <FormControl isRequired>
                                            <FormLabel>Recurring Interval</FormLabel>
                                            <Select id="recurringInterval" width="50%"  value={recurringInterval} onChange={(ev) => setRecurringInterval(ev.target.value)}>
                                                <option value="">Recurring Interval</option>
                                                {ScheduleJobConstants.RECURRING_INTERVALS?.map((recurringInterval) => (
                                                    <option value={recurringInterval.recurringIntervalId}>{recurringInterval.recurringIntervalName}</option>
                                                ))}
                                            </Select>
                                        </FormControl>    
                                    </>:<></>}
                                </HStack>
                                <HStack>
                                        <FormControl isRequired>
                                            <FormLabel>Schedule Date</FormLabel>
                                            <HStack>
                                                <Input type="text" readOnly width="50%" value={util.getFormattedDate(scheduleDate)} />
                                                <DatePicker onChange={handleScheduleDate}/> 
                                            </HStack>
                                        </FormControl> 
                                        <FormControl isRequired>
                                            <FormLabel>Schedule Time (24HRS)</FormLabel>
                                            <HStack spacing={3}>
                                                <Select id="scheduleHour" width="20%"  value={scheduleHour} onChange={(ev) => setScheduleHour(ev.target.value)}>
                                                    {CommonConstants.HOURS_LOOKUP?.map((hourLookup) => (
                                                        <option value={hourLookup}>{hourLookup}</option>
                                                    ))}
                                                </Select>                                            
                                                <Select id="scheduleMinute" width="20%"  value={scheduleMinute} onChange={(ev) => setScheduleMinute(ev.target.value)}>
                                                {CommonConstants.MINUTES_LOOKUP?.map((minuteLookup) => (
                                                    <option value={minuteLookup}>{minuteLookup}</option>
                                                ))}
                                            </Select>                                            

                                            </HStack>
                                        </FormControl>                                
                                </HStack>                                    
                            </Stack>
                        </CardBody>
                        <CardFooter>                        
                            <HStack>
                                <Button size="xs" colorScheme="yellow" onClick={props.onClose}>
                                    Cancel
                                </Button>                                      
                                <Button size="xs" colorScheme='red' onClick={handleSaveJob}>
                                    Add Job
                                </Button>
                            </HStack>
                        </CardFooter>
                    </Card>                  
                </>:<>
                    <HStack>
                        <Button size="xs" colorScheme="yellow" onClick={props.onClose}>
                            Cancel
                        </Button>                                      
                        <Button size="xs" colorScheme='red' onClick={handleAddJob}>
                            Add Job
                        </Button>
                    </HStack>                
                </>}
                          
        </Stack>                    
        </>
    );
};

export default AddEditJob;