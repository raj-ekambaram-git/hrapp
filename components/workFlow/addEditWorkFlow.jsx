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
  Heading
} from '@chakra-ui/react'

import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING } from "../../constants";
import {WorkFlowConstants} from '../../constants/workFlowConstants'
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { userService, workFlowService } from "../../services";
import { util } from "../../helpers";
import DatePicker from "../common/datePicker";


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

  const handleClick = (newSize) => {
    setSize(newSize)
    onOpen()
    getTaskList()
    getAssignedToList()
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

  }


  const handleAddExtraRow = (inputType) => {
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
    if(inpputType === "task") {
        newSteps[index]["task"]= inputValue.target.value
    }else if (inpputType === "assignedTo") {
      // newConfigData[index]["key"]= "***"+inputValue+"***/"
      newSteps[index]["assignedTo"]=inputValue.target.value
    }else if (inpputType === "dueDate") {
        // newConfigData[index]["key"]= "***"+inputValue+"***/"
        newSteps[index]["dueDate"]= new Date(inputValue)
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
              onClick={() => handleClick("xl")}
              key="xl"
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
                                            <HStack width="63%">
                                                <FormControl isRequired>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input type="text" id="name" onChange={(ev) => setName(ev.target.value)}/>
                                                </FormControl>   
                                                <FormControl isRequired>
                                                    <FormLabel>Status</FormLabel>
                                                    <Select id="status" value={status} onChange={(ev) => setStatus(ev.target.value)}>
                                                        <option value="">Select Status</option>
                                                        {WorkFlowConstants.WORKFLOW_STATUS_LOOKIUP?.map((status) => (
                                                            <option value={status.key}>{status.displayName}</option>
                                                        ))}
                                                    </Select>
                                                </FormControl>                                                   
                                            </HStack>
                                            <Stack spacing={5}>
                                                <Heading size="h4"> Add/Remove Steps</Heading>
                                                
                                                <Box alignContent="left">
                                                {steps?.map((step, index) => 
                                                    <HStack marginBottom={3}>
                                                        <Select id="stepTask" width="50%" value={step.task} onChange={(ev) => handleStepEntry("task",ev, index)}>
                                                            <option value="">Select Task</option>
                                                            {tasks && tasks?.map((taskVal) => (
                                                                <option value={taskVal.id} >{taskVal.name}</option>
                                                            ))}
                                                        </Select>   
                                                        <Select id="assignedTo" width="50%" value={step.assignedTo} onChange={(ev) => handleStepEntry("assignedTo",ev, index)}>
                                                            <option value="">Assigned To</option>
                                                            {assignedTos?.map((assingedTo) => (
                                                                <option value={assingedTo.id} >{assingedTo.firstName} {assingedTo.lastName}</option>
                                                            ))}
                                                        </Select>                                                       
                                                        <HStack>
                                                            <Input type="text" value={util.getFormattedDate(step.dueDate)} />
                                                            <DatePicker onChange={handleDueDate} rowIndex={index}/> 
                                                        </HStack>   
                                                        {index === 0?<>
                                                            <SmallAddIcon onClick={() => handleAddExtraRow("steps")}/>
                                                        </>:<>
                                                            <SmallAddIcon onClick={() => handleAddExtraRow("steps")}/>
                                                            <SmallCloseIcon onClick={() => handleRemoveRow("steps", index)}/>
                                                        </>}
                                                        
                                                    </HStack>                                                
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
                                            <Button size="xs" colorScheme='red' onClick={handleSaveWorkFlow}>
                                               {props.isAddMode?"Save New WorkFlow": "Update WorkFlow"}
                                            </Button>
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
