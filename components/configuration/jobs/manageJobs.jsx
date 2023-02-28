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
  Switch,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import { useDispatch } from "react-redux";
import { EMPTY_STRING, ScheduleJobConstants } from "../../../constants";
import { schedulerService, userService } from "../../../services";
import { CustomTable } from "../../customTable/Table";
import AddEditJob from "./addEditJob";
import {Spinner} from '../../common/spinner'
import { MdCancel } from 'react-icons/md';
import { DeleteIcon } from "@chakra-ui/icons";



const ManageJobs = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [jobs, setJobs] = useState();
  const [loading, setLoading] = useState(false);
  const SCHEDULE_JOB_LIST_TABLE_COLUMNS = React.useMemo(() => ScheduleJobConstants.JOB_LIST_TABLE_META)

  const handleClick = async (newSize) => {
    // setJobs(null)
    setSize(newSize)
    getJobsByAccount()
    onOpen()
  }

  const getJobsByAccount = async() => {
    setLoading(true)
    const responseData = await schedulerService.getScheduleJobs(userService.getAccountDetails().accountId);
    if(responseData && responseData.length>0) {
      updateJobsForDisplay(responseData.data)   
    }  
    setLoading(false)  
  }

  const handleStatusUpdate = async(toStatus, jobName, jobGroup) => {
    setLoading(true)

    const responseData = await schedulerService.updateStatus(toStatus, jobName, jobGroup, userService.userValue.id, userService.getAccountDetails().accountId)

    if(responseData.error) {
      toast({
        title: "Update Schedule Job",
        description: 'Error updating job, please try again later or contact administrator. Details:'+err.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Update Schedule Job",
        description: 'Successfully updated the job.',
        status: 'success',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })

      if(jobs) {
        const newJobList = [...jobs]    
        const updatedList = newJobList.map((job) => {
          if(job.jobName === jobName) {
            job.jobStatus = toStatus === ScheduleJobConstants.JOB_STATUS.Pause?"PAUSED":toStatus === ScheduleJobConstants.JOB_STATUS.Resume?"SCHEDULED":toStatus === ScheduleJobConstants.JOB_STATUS.Cancel?"COMPLETE":toStatus === ScheduleJobConstants.JOB_STATUS.Delete?"DELETED":""
          }
          return job;
        })
        updateJobsForDisplay(updatedList)
  
      } else {
        onClose()
      }
    }

    setLoading(false)

  }

  function updateJobsForDisplay(responseData) {
    const updatedList =  responseData.map((job, index)=> {      
      job.typeName = job?.requestData?.templateName;
      if(job.jobStatus === "SCHEDULED") {
        //Paus and Cancel
        job.updateActions =  <HStack><Switch colorScheme='red' size='sm' id='pause' isChecked onChange={() => handleStatusUpdate(ScheduleJobConstants.JOB_STATUS.Pause, job.jobName, job.groupName)} >Pause</Switch> 
                                  <MdCancel size="20" onClick={() => handleStatusUpdate(ScheduleJobConstants.JOB_STATUS.Cancel, job.jobName, job.groupName)} /></HStack>
      } else if (job.jobStatus === "PAUSED") {
        //Resume and Cancel
        job.updateActions =  <HStack><Switch colorScheme='teal' size='sm' id='pause' isChecked onChange={() => handleStatusUpdate(ScheduleJobConstants.JOB_STATUS.Resume, job.jobName, job.groupName)} >Resume</Switch> <MdCancel size="20" onClick={() => handleStatusUpdate(ScheduleJobConstants.JOB_STATUS.Cancel, job.jobName, job.groupName)} /> </HStack>
      } else if (job.jobStatus === "COMPLETE") {
        //Onlly Cancel
        // job.updateActions = <DeleteIcon boxSize={4}/>
      }
      job.deleteAction = <DeleteIcon  onClick={() => handleStatusUpdate(ScheduleJobConstants.JOB_STATUS.Delete, job.jobName, job.groupName)}  boxSize={3}/>
      
      return job;
    });
    setJobs(updatedList);
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
