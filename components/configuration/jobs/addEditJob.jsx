import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Box,
    Stack,
    HStack,
    useToast,
    Input,
    Text,
    Card,
    CardBody,
    CardFooter,
    Select,
    CardHeader,
    Textarea,
    FormControl,
    FormLabel,
    Switch,
    Spinner,
    Checkbox
  } from '@chakra-ui/react';
import { EMPTY_STRING, ScheduleJobConstants } from "../../../constants";
import { importExportService, userService } from "../../../services";



const AddEditJob = (props) => {
    const toast = useToast();
    const [enableAddNew, setEnableAddNew] = useState(false);
    const [enableRecurring, setEnableRecurring] = useState(false);
    const [recurringInterval, setRecurringInterval] = useState();
    const [templates, setTemplates] = useState();
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

    const handleSaveJob = async() => {
        
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
                                            <Select  id="type" width="50%" value={type} onChange={(ev) => setType(ev.target.value)}>
                                                <option value="">Select Type</option>
                                                {templates?.map((template) => (
                                                    <option value={template.id} 
                                                            data-queryMeta={template.queryMeta}
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