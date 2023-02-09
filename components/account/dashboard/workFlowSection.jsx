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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {userService, workFlowService} from '../../../services'

function WorkFlowSection(props) {
    const router = useRouter();
    const [workFlowData, setWorkFlowData] = useState();
    useEffect(() => {
        getWorkFlowData()
      }, []);
    
      const getWorkFlowData = async () => {
        if(userService.isWorkFlowAdmin() || userService.isWorkFlowContributor) {
            const responseData = await workFlowService.getDashBoardData(userService.userValue.id, userService.getAccountDetails().accountId);
            console.log("responseData:::"+JSON.stringify(responseData))
            setWorkFlowData(responseData)
        }
        
      }

    return (
        <>
            {workFlowData?
                <Card variant="workFlowDashboard">
                    <CardHeader>
                        WorkFlow Tasks
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
                                                <Box textAlign="right" fontWeight="600">
                                                    {countData.status}
                                                </Box>
                                                <Box textAlign="left">
                                                    {countData._count}
                                                </Box>
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
                                                <Box textAlign="right" fontWeight="600">
                                                    {countData.status}
                                                </Box>
                                                <Box textAlign="left">
                                                    {countData._count}
                                                </Box>
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
                                        <HStack>
                                            <Box width="50%" textAlign="right" fontWeight="600">
                                                {countData.status}
                                            </Box>
                                            <Box  width="20%" textAlign="left">
                                                {countData._count}
                                            </Box>
                                        </HStack>                                    
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