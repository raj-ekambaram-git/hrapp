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
import { EMPTY_STRING, ScheduleJobConstants } from "../../../constants";
import { schedulerService, userService } from "../../../services";
import { CustomTable } from "../../customTable/Table";
import AddEditJob from "./addEditJob";
import {Spinner} from '../../common/spinner'

const ManageJobs = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [jobs, setJobs] = useState();
  const [loading, setLoading] = useState(false);
  const SCHEDULE_JOB_LIST_TABLE_COLUMNS = React.useMemo(() => ScheduleJobConstants.JOB_LIST_TABLE_META)

  const handleClick = (newSize) => {
    setJobs(null)
    setSize(newSize)
    getJobsByAccount()
    onOpen()
  }

  const getJobsByAccount = async() => {
    setLoading(true)
    const responseData = await schedulerService.getScheduleJobs(userService.getAccountDetails().accountId);
    if(responseData) {
      updateJobsForDisplay(responseData.data)   
    }  
    setLoading(false)  
  }


  function updateJobsForDisplay(responseData) {
    const updatedList =  responseData.map((job, index)=> {      
      job.typeName = job?.requestData?.templateName;
      return job;
    });
    setJobs(updatedList);
  }

  const addNewTask = (newJob) => {
    const newJobs = [...jobs]
    newJobs.push(newJob)
    updateJobsForDisplay(newJobs)
  }
  
  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Manage Jobs`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Manage Schedule Jobs
                            </DrawerHeader>
                            <DrawerBody>
                              {loading?<><Spinner/></>:<></>}
                              <Stack divider={<StackDivider />} spacing='1'>
                                <AddEditJob onClose={onClose}/>
                                {jobs?<>
                                  <CustomTable  columns={SCHEDULE_JOB_LIST_TABLE_COLUMNS} rows={jobs} />                                
                                </>:<></>}                              
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default ManageJobs;
