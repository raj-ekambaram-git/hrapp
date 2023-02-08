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
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Badge,
  useToast
} from '@chakra-ui/react'
import { useDispatch } from "react-redux";
import { documentService, userService, workFlowService } from "../../services";
import { DocumentConstants, EMPTY_STRING, WorkFlowConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";


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
      setTasks(updateTasksForDisplay(responseData))      
    }    
  }

  function updateTasksForDisplay(responseData) {
    return responseData.map((task)=> {
      task.updatedBy = task.updatedUser.firstName+" "+task.updatedUser.lastName;
      return task;
    });
  }

  async function handleDeleteTask(documentId, index) {
    const updateDocumentRequest = {
      id: documentId,
      status: DocumentConstants.DOCUMENT_STATUS.Delete
    }
    const responseData = await documentService.updateDocument(updateDocumentRequest)
    if(responseData.error) {
      toast({
          title: 'Update Document.',
          description: 'Error updating document, please try again. Details:'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
    }else {
      toast({
          title: 'Update Document.',
          description: 'Successfully udpated document.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        dispatch(removeDocumentByIndex(index))
    }
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
