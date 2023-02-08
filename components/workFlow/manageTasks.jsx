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
  Switch
} from '@chakra-ui/react'
import { useDispatch } from "react-redux";
import { userService, workFlowService } from "../../services";
import { EMPTY_STRING, WorkFlowConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";
import AddEditTask from "./addEditTask";
import { WorkFlowTaskStatus } from "@prisma/client";


const ManageTasks = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [tasks, setTasks] = useState();
  const WF_TASK_LIST_TABLE_COLUMNS = React.useMemo(() => WorkFlowConstants.TASK_LIST_TABLE_META)

  const handleClick = (newSize) => {
    setTasks(null)
    setSize(newSize)
    getTasksByAccount()
    onOpen()
  }

  const getTasksByAccount = async() => {
    const responseData = await workFlowService.getTasksByAccount(userService.getAccountDetails().accountId);
    if(responseData) {
      updateTasksForDisplay(responseData)   
    }    
  }

  const handleStatusUpdate = async(oldSatatus, taskId, index) => {
    let status = WorkFlowTaskStatus.Active
    if(oldSatatus === WorkFlowTaskStatus.Active) {
      status = WorkFlowTaskStatus.Inactive
    }

    const taskRequest = {
      id: taskId,
      status: status,
      updatedBy: parseInt(userService.userValue.id)
    }
    const responseData = await workFlowService.updateTask(taskRequest, userService.getAccountDetails().accountId)
    if(responseData.error) {
      toast({
        title: 'Update Task.',
        description: "Error updating task for you account. Details: "+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }else {
      toast({
        title: 'Updated Task.',
        description: 'Successfully update task for your account.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })      
      const newTasks = [...tasks]
      const updatedList = newTasks.map((task) => {
        if(task.id === responseData.id) {
          task.status = responseData.status
        }
        return task;
      })

      updateTasksForDisplay(updatedList)
    }
  }

  function updateTasksForDisplay(responseData) {
    const updatedList =  responseData.map((task, index)=> {      
      task.updatedBy = task.updatedUser.firstName+" "+task.updatedUser.lastName;
      task.toggleStatus = <Switch colorScheme='teal' size='sm' isChecked={task.status === WorkFlowTaskStatus.Active?true:false} onChange={() => handleStatusUpdate(task.status, task.id, index)}/>   
      return task;
    });
    setTasks(updatedList);
  }

  const addNewTask = (newTask) => {
    const newTasks = [...tasks]
    newTasks.push(newTask)
    updateTasksForDisplay(newTasks)
  }
  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Manage Tasks`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Manage WorkFlow Tasks
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack divider={<StackDivider />} spacing='1'>
                                <AddEditTask onClose={onClose} addNewTask={addNewTask}/>
                                {tasks?<>
                                  <CustomTable  columns={WF_TASK_LIST_TABLE_COLUMNS} rows={tasks} />                                
                                </>:<></>}                              
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default ManageTasks;
