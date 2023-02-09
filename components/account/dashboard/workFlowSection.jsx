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
            setWorkFlowData(responseData)
        }
        
      }

    return (
        <>
            {workFlowData?
                <Card variant="workFlowDashboard">
                    <CardHeader>
                        WorkFlow tasks to manage
                    </CardHeader>
                    <CardBody>
                        <Stack width="100%" marginBottom={4} spacing={8}>
                            <HStack spacing="85px" marginLeft={6}>
                                {workFlowData.pastDue && workFlowData.pastDue.length>0?<>
                                    <Stack>
                                        <Box textAlign="left" color="white" fontWeight="600" bgColor="pending_status" padding={1} border="1px" borderRadius="5px"> 
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
                                {workFlowData.todayDue?<>
                                    <Stack>
                                        <Box textAlign="left" fontWeight="600" bgColor="paid_status" padding={1} border="1px" borderRadius="5px"> 
                                            Today Due
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
                            {workFlowData.all?<>
                                <Stack>
                                    <Box  textAlign="center" fontWeight="600" bgColor="inner_table_tile" padding={1} border="1px" borderRadius="5px"> 
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
                        </Stack>
                    </CardBody>
                </Card>
            : <></>}
        </>
        


    );
}