export { ApprovalSection };
import {
    Box,
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
                                        <Link href="#" onClick={() => router.push("/account/user/timesheets/approval")}>
                                            {approvalData.billableTimesheetCount}
                                        </Link>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="60%" textAlign="right" fontWeight="600">
                                    Non-Billable Timesheets:
                                </Box>
                                <Box width="10%" textAlign="left">
                                        <Link href="#" onClick={() => router.push("/account/user/timesheets/approval")}>
                                            {approvalData.nonBillableTimesheetCount}
                                        </Link>
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="60%" textAlign="right" fontWeight="600">
                                    Expenses:
                                </Box>
                                <Box width="10%" textAlign="left">
                                        <Link href="#" onClick={() => router.push("/account/user/expenses/approval")}>
                                            {approvalData.expenseCount}
                                        </Link>
                                </Box>
                            </HStack>                                                        
                        </Stack>

                    </CardBody>
                </Card>
            : <></>}
        </>
        


    );
}