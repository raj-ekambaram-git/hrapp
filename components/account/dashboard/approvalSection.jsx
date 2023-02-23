export { ApprovalSection };
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Link,
    LinkOverlay,
    Stack,
    Text,
  } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {userService} from '../../../services'

function ApprovalSection(props) {
    const router = useRouter();
    const [approvalData, setApprovalData] = useState();
    useEffect(() => {
        getApprovalData()
      }, []);
    
      const getApprovalData = async () => {
        if(userService.isManager()) {
            const approvalData = await userService.getApprovalData(userService.userValue.id, userService.getAccountDetails().accountId);
            setApprovalData(approvalData)
        }
        
      }

    return (
        <>
            {approvalData?
                <Card variant="helpDashboard">
                    <CardHeader>
                        To Approve <Text fontSize="10px">(Click # to get to list of items)</Text>
                    </CardHeader>
                    <CardBody>
                        <Stack width="100%" marginBottom={4}>
                            <HStack>
                                <Box width="60%" textAlign="right" fontWeight="600">
                                    Billable Timesheets:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    <Button bgColor="header_actions" onClick={() => router.push("/account/user/timesheets/approval")} fontWeight="800" fontSize="14">
                                        {approvalData.billableTimesheetCount}
                                    </Button>                                    
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="60%" textAlign="right" fontWeight="600">
                                    Non-Billable Timesheets:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    <Button bgColor="header_actions" onClick={() => router.push("/account/user/timesheets/approval")} fontWeight="800" fontSize="14">
                                        {approvalData.nonBillableTimesheetCount}
                                    </Button>                                      
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="60%" textAlign="right" fontWeight="600">
                                    Expenses:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    <Button bgColor="header_actions" onClick={() => router.push("/account/user/expenses/approval")} fontWeight="800" fontSize="14">
                                        {approvalData.expenseCount}
                                    </Button>                                      
                                </Box>
                            </HStack>                                                        
                        </Stack>

                    </CardBody>
                </Card>
            : <></>}
        </>
        


    );
}