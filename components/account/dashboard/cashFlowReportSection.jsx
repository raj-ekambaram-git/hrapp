export { CashFlowReportSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import {accountService, userService} from '../../../services'

function CashFlowReportSection(props) {
    const [cashFlowData, setCashFlowData] = useState();

    useEffect(() => {
        getCashFlowData()
      }, []);
    
      const getCashFlowData = async () => {
        if(userService.isAccountAdmin()) {
            const cashFlowData = await accountService.getCashFlowData(userService.getAccountDetails().accountId);
            setCashFlowData(cashFlowData)
        }
        
      }    
    return (
        <Card variant="helpDashboard">
            <CardHeader>
                <HStack>
                    <Box>
                        Cash Flow
                    </Box>
                </HStack>
                
            </CardHeader>
            <CardBody>
                <Stack width="40%" marginBottom={4}>
                    <HStack>
                        <Box  width="50%" textAlign="right" fontWeight="600">
                            
                        </Box>
                        <Box width="60%" textAlign="left">
                            Links TODO
                        </Box>
                    </HStack>                                          
                </Stack>
            </CardBody>
        </Card>

    );
}