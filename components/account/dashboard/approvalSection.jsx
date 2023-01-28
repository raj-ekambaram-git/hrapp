export { ApprovalSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Spacer,
    Stack,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { util } from '../../../helpers/util';
import {userService} from '../../../services'

function ApprovalSection(props) {

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
                <Card variant="dashboardWelcome">
                    <CardHeader>
                        <HStack>
                            <Box textAlign="center">
                                To Approve
                            </Box>
                        </HStack>
                        
                    </CardHeader>
                    <CardBody>
                        <Stack width="50%" marginBottom={4}>
                            <HStack>
                                <Box width="80%" textAlign="right" fontWeight="600">
                                    Billable Timesheets:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    {approvalData.billableTimesheetCount}
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="80%" textAlign="right" fontWeight="600">
                                    Non-Billable Timesheets:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    {approvalData.nonBillableExpenseCount}
                                </Box>
                            </HStack>
                            <HStack>
                                <Box width="80%" textAlign="right" fontWeight="600">
                                    Expenses:
                                </Box>
                                <Box width="10%" textAlign="left">
                                    {approvalData.expenseCount}
                                </Box>
                            </HStack>                                                        
                        </Stack>

                    </CardBody>
                </Card>
            : <></>}
        </>
        


    );
}