import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  StackDivider,
  useDisclosure,
  useToast,
  CardBody,
  HStack,
  FormControl,
  Card,
  FormLabel,
  Input,
  Select,
  CardFooter,
  Box,
  Heading,
  Text,
  Badge,
  Spacer,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton
} from '@chakra-ui/react'

import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING } from "../../constants";
import {WorkFlowConstants} from '../../constants/workFlowConstants'
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { userService, workFlowService } from "../../services";
import { util, workFlowUtil } from "../../helpers";
import DatePicker from "../common/datePicker";
import { WorkFlowStatus, WorkFlowStepStatus } from "@prisma/client";


const AddEditWorkFlow = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [status, setStatus] = useState(EMPTY_STRING);
  const [name, setName] = useState(EMPTY_STRING);
  const [steps, setSteps] = useState([{}]);
  const [tasks, setTasks] = useState();
  const [assignedTos, setAssignedTos] = useState();



  const handleStatusUpdate = async(statusToUpdate, stepId, index) => {

    const stepRequest = {
      id: stepId,
      status: statusToUpdate,
      completedDate: statusToUpdate === WorkFlowStepStatus.Complete?new Date():null

    }
    const responseData = await workFlowService.updateStep(stepRequest, stepId, userService.getAccountDetails().accountId)
    if(responseData.error) {
      toast({
        title: 'Update Step.',
        description: "Error updating step for this workflow. Details: "+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }else {
      toast({
        title: 'Updated Step.',
        description: 'Successfully update step for this workflow.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })      
      const newSteps = [...steps]
      const updatedList = newSteps.map((step) => {
        if(step.id === responseData.id) {
            step.status = responseData.status
            if(responseData.status === WorkFlowStepStatus.Complete) {
                step.completedDate = responseData.completedDate
            }
        }
        return step;
      })

      setSteps(updatedList)
    }
  }

  const handleClick = (newSize) => {
    console.log("props.typeId:::::"+props.typeId)
    setSize(newSize)
    onOpen()
    getTaskList()
    getAssignedToList()

    if(props.isAddMode) {
        if(props.workFlow) {
            setName(props.workFlow?.name)
            setStatus(props.workFlow?.status)
            setSteps(props.workFlow?.steps)
        }    
    } else if (!props.isAddMode && props.typeId){
        //Get the WorkFlow ID and get the detaiils for the same
        getWorkFlowData()
    }
  }

  const getWorkFlowData = async() => {
    const responseData = await workFlowService.getWorkFlowData(props.type, props.typeId, userService.getAccountDetails().accountId)
    if(responseData.error) {
        toast({
            title: 'Work Flow Error.',
            description: 'Error getting workflow details, please try again later or contact administrator.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })   
          return;     
    } else {
        setName(responseData.name)
        setStatus(responseData.status)
        setSteps(responseData.workFlowSteps)
    }
  }

  const getTaskList = async() => {
    const responseData = await workFlowService.getTaskListByType(props.type, userService.getAccountDetails().accountId)
    setTasks(responseData)    
  }

  const getAssignedToList = async() => {
    const responseData = await workFlowService.getAssignedToList(userService.getAccountDetails().accountId)
    setAssignedTos(responseData)    
  }

  const handleSaveWorkFlow = () => {
    if(name && status && steps && !workFlowUtil.validateStepsDataFilled(steps)) {
        if(!workFlowUtil.checkDueDatesAreValid(steps)) {
            const workFlowData = {
                name: name,
                status: status,
                steps: steps,
                userId: userService.userValue.id
            }
            props.setWorkFlow(workFlowData)
            onClose()
        } else {
            toast({
                title: 'Work Flow Error.',
                description: 'Please check the due dates configured for steps, all due dates should be equal or greater than today with sequence.',
                status: 'error',
                position: 'top',
                duration: 6000,
                isClosable: true,
              })   
              return;            
        }

    }else {
        toast({
            title: 'Work Flow Error.',
            description: 'All the fields are requirred and needs at least one step configured.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })   
          return;
    }
  }


  const handleAddExtraRow = (inputType, index) => {
    if(inputType === "steps") {
      const newSteps = [...steps]
      newSteps.push({})
      setSteps(newSteps)
    }
  }

  const handleRemoveRow = (inputType, index) => {
    if(inputType === "steps") {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps)
    }
  }

  const handleStepEntry = (inpputType, inputValue, index) => {
    const newSteps = [...steps]
    if(inpputType === "taskId") {
        newSteps[index]["taskId"]= inputValue.target.value
        newSteps[index]["status"]= WorkFlowStepStatus.Pending
    } else if (inpputType === "assignedTo") {
      newSteps[index]["assignedTo"]=inputValue.target.value
    } else if (inpputType === "dueDate") {
        newSteps[index]["dueDate"]= new Date(inputValue)
    } else if (inpputType === "stepNumber") {                
    }
    setSteps(newSteps)    
  }

  function handleDueDate(e) {
    if(e != undefined && (e.updatedDate)) {
      const newSteps = [...steps]
      if(util.getFormattedDate(newSteps[e.rowIndex].dueDate) != util.getFormattedDate(e.date)) {
        newSteps[e.rowIndex].dueDate = e.date;
        setSteps(newSteps)
      }      
    }    
  }

  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Manage WorkFlow`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Manage WorkFlow
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <Card >
                                    <CardBody>
                                        <Stack spacing={9}>
                                            <HStack width="63%" spacing={6}>
                                                <FormControl isRequired>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input type="text" id="name" value={name} onChange={(ev) => setName(ev.target.value)}/>
                                                </FormControl>   
                                                <FormControl isRequired>
                                                    <FormLabel>Status</FormLabel>
                                                    {props.isAddMode?<>
                                                        <Select id="status" value={status} onChange={(ev) => setStatus(ev.target.value)}>
                                                            <option value="">Select Status</option>
                                                            {WorkFlowConstants.WORKFLOW_STATUS_LOOKIUP?.map((status) => (
                                                                <option value={status.key}>{status.displayName}</option>
                                                            ))}
                                                        </Select>
                                                    </>:<>
                                                        <Badge color={status === WorkFlowStatus.Active?"paid_status":"pending_status"}>{status}</Badge>
                                                    </>}
                                                </FormControl>                                                   
                                            </HStack>
                                            <Stack spacing={7}>
                                                <Heading size="h4"> {props.isAddMode?"Add/Remove Steps":"Steps"}</Heading>                                                
                                                <Box alignContent="left">
                                                    {steps?.map((step, index) => 
                                                        <>
                                                        <HStack marginBottom={1} spacing={3}>
                                                            <Button bgColor="header_actions" fontWeight="600" fontSize="15">
                                                                {index+1}
                                                            </Button>
                                                            <Select id="stepTask" width="22%" value={step.taskId} onChange={(ev) => handleStepEntry("taskId",ev, index)}>
                                                                <option value="">Select Task</option>
                                                                {tasks && tasks?.map((taskVal) => (
                                                                    <option value={taskVal.id} >{taskVal.name}</option>
                                                                ))}
                                                            </Select>   
                                                            <Select id="assignedTo" width="22%" value={step.assignedTo} onChange={(ev) => handleStepEntry("assignedTo",ev, index)}>
                                                                <option value="">Assigned To</option>
                                                                {assignedTos?.map((assingedTo) => (
                                                                    <option value={assingedTo.id} >{assingedTo.firstName} {assingedTo.lastName}</option>
                                                                ))}
                                                            </Select>                                                       
                                                            <HStack>
                                                                <Input type="text" width="100%" value={util.getFormattedDate(step.dueDate)} />
                                                                <DatePicker onChange={handleDueDate} rowIndex={index}/> 
                                                                {index === 0?<>
                                                                    <SmallAddIcon onClick={() => handleAddExtraRow("steps", index)}/>
                                                                    <Spacer maxWidth={3} />
                                                                </>:<>
                                                                    <SmallAddIcon onClick={() => handleAddExtraRow("steps", index)}/>
                                                                    {!props.isAddMode && step.status && (step.status === WorkFlowStepStatus.InProgress || step.status === WorkFlowStepStatus.Complete)?<> <Spacer maxWidth={2} /></>:<>
                                                                        <SmallCloseIcon onClick={() => handleRemoveRow("steps", index)}/>
                                                                    </>}                                                                                                                         
                                                                </>}                                                                
                                                            </HStack>                                                          
                                                        
                                                            {!props.isAddMode && step.status?<>
                                                                <Badge color={step.status === WorkFlowStepStatus.Complete?"paid_status":
                                                                                step.status === WorkFlowStepStatus.Pending?"":
                                                                                (step.status === WorkFlowStepStatus.Pending) && (new Date() > step.dueDate)?"pending_status":"pending_status"}>{step.status} </Badge>
                                                                {step.status === WorkFlowStepStatus.Complete?<><Text fontSize={12} fontWeight="600">( {util.getFormattedDateWithTime(step.completedDate)} )</Text></>:<></>}                                                                            
                                                                {(step.status === WorkFlowStepStatus.InProgress && step.assignedTo === userService.userValue.id)?<><Switch colorScheme='teal' size='sm' id='inProgress' isChecked onChange={() => handleStatusUpdate(WorkFlowStepStatus.Complete, step.id, index)} >Mark Complete</Switch></>:<></>}                                                                            
                                                                {(step.status === WorkFlowStepStatus.Pending && index == 0  && step.assignedTo === userService.userValue.id)?<><Switch colorScheme='red' size='sm' id='pending' isChecked onChange={() => handleStatusUpdate(WorkFlowStepStatus.InProgress, step.id, index)}>Start</Switch></>:
                                                                    (step.status === WorkFlowStepStatus.Pending && steps[index-1]?.status == WorkFlowStepStatus.Complete  && step.assignedTo === userService.userValue.id)?<><><Switch colorScheme='red' size='sm' id='pending' isChecked onChange={() => handleStatusUpdate(WorkFlowStepStatus.InProgress, step.id, index)}>Start</Switch></></>:<></>}                                                                            
                                                            </>:<></>} 
                                                            
                                                        </HStack>  
                                                        {index+1 < steps.length?<>
                                                            <Slider aria-label='slider-ex-3' defaultValue={30} orientation='vertical' minH='20' marginLeft='4' >
                                                                <SliderTrack bg="teal.500"/>                                                                                                                        
                                                            </Slider>    
                                                        </>:<></>}    
                                                        </>                                      
                                                    )}   
                                                </Box>        
                                            </Stack>                                    
                                        </Stack>
                                    </CardBody>
                                    <CardFooter>
                                        <HStack>
                                            <Button size="xs" colorScheme="yellow" onClick={onClose}>
                                                Cancel
                                            </Button>                                      
                                            {props.isAddMode?
                                                <Button size="xs" colorScheme='red' onClick={handleSaveWorkFlow}>
                                                Save New WorkFlow
                                                </Button>
                                            : <></>}
                                        </HStack>                                        
                                    </CardFooter>
                                </Card>
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default AddEditWorkFlow;
