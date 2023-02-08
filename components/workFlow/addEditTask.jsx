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
    Spinner,
    CardHeader,
    Textarea,
    FormControl,
    FormLabel,
    Switch
  } from '@chakra-ui/react';
import { EMPTY_STRING, WorkFlowConstants } from "../../constants";
import { ErrorMessage } from "../../constants/errorMessage";
import { userService, workFlowService } from "../../services";



const AddEditTask = (props) => {
    const toast = useToast();
    const [type, setType] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [status, setStatus] = useState();
    const [loading, setLoading] = useState();


    useEffect(() => {
        resetValues()
    }, []);

    const resetValues = () => {
        setLoading(false)
        setType(EMPTY_STRING)
        setName(EMPTY_STRING)
        setDescription(EMPTY_STRING)
        setStatus(EMPTY_STRING)
    }

    const handleSaveTask = async() => {
        if(name && type && description && status) {
            const newWFTaskRequest = {
                type: type,
                name: name,
                description: description,
                status: status,
                accountId: parseInt(userService.getAccountDetails().accountId),
                updatedBy: parseInt(userService.userValue.id)
            }

            const responseData = await workFlowService.createTask(newWFTaskRequest, userService.getAccountDetails().accountId)
            console.log("responseData:::"+JSON.stringify(responseData))
            if(responseData.error) {
                toast({
                    title: 'New Task.',
                    description: "Error create new task for you account. Details: "+responseData.errorMessage,
                    status: 'error',
                    position: 'top',
                    duration: 6000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'New Task.',
                    description: 'Successfully added new task for your account.',
                    status: 'success',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                })
                props.addNewTask(responseData)
                resetValues()
            }

        }else {
            toast({
                title: 'New Task.',
                description: ErrorMessage.ALL_FIELDS_REQIURED,
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
            })
            return;
        }
    }

    return (
        <>
        <Stack spacing={5} marginBottom={6}>
            {loading? (
                  <>
                  <Spinner/>
                  </>
                ) : (<></>)}
                <Card variant="workflowTaskForm">
                    <CardHeader>
                        Add New WorkFlow Task
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            <HStack spacing={2}>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Type</FormLabel>
                                        <Select  id="type" value={type} onChange={(ev) => setType(ev.target.value)}>
                                            <option value="">Select Type</option>
                                            {WorkFlowConstants.WORKFLOW_TYPE_LOOKIUP?.map((type) => (
                                                <option value={type.key}>{type.displayName}</option>
                                            ))}
                                        </Select>
                                    </FormControl>     
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Name</FormLabel>
                                        <Input type="text" value={name} id="name"  onChange={(ev) => setName(ev.target.value)}></Input>
                                    </FormControl> 
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Description</FormLabel>
                                        <Input type="text" value={description} id="description"  onChange={(ev) => setDescription(ev.target.value)}></Input>                  
                                    </FormControl> 
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Status</FormLabel>
                                        <Select id="status" value={status} onChange={(ev) => setStatus(ev.target.value)}>
                                            <option value="">Select Status</option>
                                            {WorkFlowConstants.WORKFLOW_STATUS_LOOKIUP?.map((status) => (
                                                <option value={status.key}>{status.displayName}</option>
                                            ))}
                                        </Select>
                                    </FormControl>   
                                </Box>                                                             
                            </HStack>
                        </Stack>
                    </CardBody>
                    <CardFooter>                        
                        <HStack>
                            <Button size="xs" colorScheme="yellow" onClick={props.onClose}>
                                Cancel
                            </Button>                                      
                            <Button size="xs" colorScheme='red' onClick={handleSaveTask}>
                                Save New Task
                            </Button>
                        </HStack>
                    </CardFooter>
                </Card>                            
        </Stack>                    
        </>
    );
};

export default AddEditTask;