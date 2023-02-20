export { MyWorkFlowTaskDetailSection };
import React, { useState, useEffect } from "react";
import {
  useDisclosure,
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  HStack,
  Card,
  CardBody,
  Badge,
  Text,
  Switch,
  useToast
} from '@chakra-ui/react';
import { useRouter } from "next/router";
import { WorkFlowStepStatus, WorkFlowTaskType } from "@prisma/client";
import {Spinner} from '../../common/spinner'
import { userService, workFlowService } from "../../../services";
import { WorkFlowConstants } from "../../../constants";
import { util } from "../../../helpers";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function MyWorkFlowTaskDetailSection(props) {
    const router = useRouter();
    const toast = useToast();
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [myTasks, setMyTasks] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
  

    const handleMyTasks = async (newSize) => {
        setSize(newSize);
        onOpen();
        setLoading(true)
        const responseData = await workFlowService.getMyTasks(userService.userValue.id, userService.getAccountDetails().accountId, props.taskStatus,props.taskRequest )
        setMyTasks(responseData)
        // updateInvoicesForDisplay(responseData)    
        setLoading(false)
    }

    const handleStatusUpdate = async (statusToUpdate, stepId) => {
        setLoading(true)
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
            const newMyTasks = [...myTasks]
            const updatedList = newMyTasks.map((task) => {
              if(task.id === responseData.id) {
                    task.status = responseData.status
                  if(responseData.status === WorkFlowStepStatus.Complete) {
                    task.completedDate = responseData.completedDate
                  }
              }
              return task;
            })

            setMyTasks(updatedList)
            setLoading(false)
        }
    }

    return (
        <>
          <Button size="xs" border="1px"
              onClick={() => handleMyTasks("xl")}
              key="xl"
              m={1} 
              >{(props.taskStatus === WorkFlowStepStatus.InProgress? "In Progress": props.taskStatus)+`: `+props.taskCount}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        {loading?<><Spinner/></>:<></>}
                        <DrawerCloseButton />
                        <DrawerHeader>
                            My Tasks  {props.taskStatus === WorkFlowStepStatus.InProgress? "In Progress": props.taskStatus} ({props.taskRequest === WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.pastDue? "Past Due": props.taskRequest === WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.currentDue? "Due Today": "All"})
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={8}>
                          {myTasks?.map((task, index) => 
                            <Card variant="document">
                                <CardBody>
                                    <Stack>
                                        <HStack spacing={5}>
                                            <Button width="5%" bgColor= {task.status === WorkFlowStepStatus.Complete?"header_actions":
                                                                task.status === WorkFlowStepStatus.InProgress?"header_actions":
                                                                task.status === WorkFlowStepStatus.Pending?"table_tile": "header_actions"} fontWeight="600" fontSize="15">
                                                {task.stepNumber}
                                            </Button>    
                                            <Box width="10%">
                                                {task.workFlow?.type === WorkFlowTaskType.Vendor?"Client": task.workFlow?.type}
                                            </Box>
                                            <Box width="25%">
                                                <HStack>
                                                    <InfoOutlineIcon />
                                                    <Text>{task.task?.name}</Text>
                                                </HStack>
                                                
                                            </Box>   
                                            <Box width="30%">
                                                <Text fontWeight="600" color={util.getLocaleDate(task.dueDate)<new Date()?"pending_status":"paid_status"}>
                                                    {task.dueDate?util.getFormattedDateWithTime(task.dueDate):""}
                                                </Text>
                                                
                                            </Box>  
                                            <Box width="30%">
                                                <HStack spacing={2}>
                                                    <Badge color={(task.status === WorkFlowStepStatus.Complete || task.status === WorkFlowStepStatus.InProgress)?"paid_status": (task.status === WorkFlowStepStatus.Pending || task.status === WorkFlowStepStatus.Delayed)? "pending_status": "pending_status"}>{task.status}</Badge>
                                                    {task.status === WorkFlowStepStatus.InProgress?<>
                                                        <Switch colorScheme='teal' size='sm' id='inProgress' isChecked onChange={() => handleStatusUpdate(WorkFlowStepStatus.Complete, task.id)} >Mark Complete</Switch>
                                                    </>:task.status === WorkFlowStepStatus.Pending?<>
                                                        <Switch colorScheme='red' size='sm' id='pending' isChecked onChange={() => handleStatusUpdate(WorkFlowStepStatus.InProgress, task.id)} >Mark In Progress</Switch>
                                                    </>:<></>}
                                                    
                                                </HStack>
                                                
                                            </Box>                                                                                                                                                                                 
                                        </HStack>
                                    </Stack>
                                </CardBody>
                            </Card>
                            )}
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>
        </>
    );
}
