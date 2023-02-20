export { WorkFlowSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Link,
    LinkOverlay,
    Stack,
    StackDivider,
    Text,
  } from '@chakra-ui/react'
import { WorkFlowStepStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { WorkFlowConstants } from '../../../constants';
import {userService, workFlowService} from '../../../services'
import  {MyWorkFlowTaskDetailSection} from './myWorkFlowTaskDetailSection'

function WorkFlowSection(props) {
    const router = useRouter();
    const [workFlowData, setWorkFlowData] = useState();
    useEffect(() => {
        getWorkFlowData()
      }, []);
    
      const getWorkFlowData = async () => {
        if(userService.isWorkFlowAdmin() || userService.isWorkFlowContributor) {
            const responseData = await workFlowService.getDashBoardData(userService.userValue.id, userService.getAccountDetails().accountId);
            setWorkFlowData(responseData)
        }
        
      }

    return (
        <>
            {workFlowData?
                <Card variant="workFlowDashboard">
                    <CardHeader>
                       My WorkFlow Tasks
                    </CardHeader>
                    <CardBody>
                        <Stack width="100%" marginBottom={4} spacing={8}>
                            <HStack spacing="85px" marginLeft={6}>
                                {workFlowData.pastDue && workFlowData.pastDue.length>0?<>
                                    <Stack>
                                        <Box textAlign="center" color="white" fontSize="10px" fontWeight="600" bgColor="pending_status" padding={1} border="1px" borderRadius="5px"> 
                                            Past Due
                                        </Box>
                                        {workFlowData.pastDue?.map((countData) => 
                                            <HStack>
                                                <MyWorkFlowTaskDetailSection taskRequest={WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.pastDue} taskStatus={countData.status} taskCount={countData._count}/>
                                                {/* <Box textAlign="right" fontWeight="600">
                                                    {countData.status === WorkFlowStepStatus.InProgress? "In Progress": countData.status}
                                                </Box>
                                                <Box textAlign="left">
                                                    {countData._count}
                                                </Box> */}
                                            </HStack>                                    
                                        )}               
                                    </Stack>                     
                                </>:<></>}
                                {workFlowData.todayDue && workFlowData.todayDue.length >0?<>
                                    <Stack>
                                        <Box textAlign="center" fontWeight="600" fontSize="10px" bgColor="paid_status" padding={1} border="1px" borderRadius="5px"> 
                                            Due Today
                                        </Box>
                                        {workFlowData.todayDue?.map((countData) => 
                                            <HStack>
                                                <MyWorkFlowTaskDetailSection taskRequest={WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.currentDue} taskStatus={countData.status} taskCount={countData._count}/>                                                                                            
                                            </HStack>                                    
                                        )}               
                                    </Stack>                     
                                </>:<></>}
                            </HStack>
                            {workFlowData.all && workFlowData.all?.length>0?<>
                                <Stack>
                                    <Box  textAlign="center" fontWeight="800" fontSize="10px" bgColor="inner_table_tile" padding={1} border="1px" borderRadius="5px"> 
                                        All
                                    </Box>
                                    {workFlowData.all?.map((countData) => 
                                        <Box  textAlign="center">
                                            <MyWorkFlowTaskDetailSection taskRequest={WorkFlowConstants.WORKFLOW_STATUS_TASK_REQUEST.all} taskStatus={countData.status} taskCount={countData._count}/>                                            
                                        </Box>                                    
                                    )}               
                                </Stack>                     
                            </>:<></>}       
                            {workFlowData.all && workFlowData.all.length ==0 && workFlowData.todayDue && workFlowData.todayDue == 0 && workFlowData.pastDue && workFlowData.pastDue.length==0?<>
                                <Box textAlign="center">
                                    No Pending or InProgress tasks
                                </Box>
                            </>:<></>} 
                        </Stack>
                    </CardBody>
                </Card>
            : <></>}
        </>
        


    );
}