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
  useToast
} from '@chakra-ui/react'
import { useDispatch } from "react-redux";
import { userService, workFlowService } from "../../services";
import { EMPTY_STRING, WorkFlowConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";
import AddEditTask from "./addEditTask";


const ManageTasks = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [tasks, setTasks] = useState();
  const WF_TASK_LIST_TABLE_COLUMNS = React.useMemo(() => WorkFlowConstants.TASK_LIST_TABLE_META)

  const handleClick = (newSize) => {
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

  function updateTasksForDisplay(responseData) {
    const updatedList =  responseData.map((task)=> {      
      task.updatedBy = task.updatedUser.firstName+" "+task.updatedUser.lastName;
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
