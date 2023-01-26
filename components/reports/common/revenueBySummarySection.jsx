import React, { useEffect } from "react";
import { Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { util } from "../../../helpers/util";


export default function RevenueBySummarySection(props) {
  
  useEffect(() => {
  }, []);
  
  return (
    <>    
        <Card variant="projectUsersFinancialSummary">
          <CardHeader>
            <Heading size='xs' textAlign="center">All Projects Summary as of {util.getFormattedDate(new Date())}</Heading>          
          </CardHeader>
          <CardBody>
              <Stack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    Estimated Revenue:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(props.totalEstimatedRevenue)}
                  </Box>                
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    Net Revenue:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(props.totalActualRevenue)}
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="60%" textAlign="right">
                    Resource Cost:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                    {util.getWithCurrency(props.totalProjectCost)}
                  </Box>                
                </HStack>          
                <HStack>
                  <Box width="60%" textAlign="right">
                    Billable Expense:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(props.totalBillableExp)}
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="60%" textAlign="right">
                    Non-Billable Expense:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                    {util.getWithCurrency(props.totalNonBillableExp)}
                  </Box>                
                </HStack>                                                           
                <HStack>
                  <Box width="60%" textAlign="right" fontWeight="semibold" fontStyle="italic">
                    Net Profit:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={util.getZeroPriceForNull(props.totalNetProfit) > 0 ? 'debit_amount':""}>
                    {util.getWithCurrency(util.getZeroPriceForNull(props.totalNetProfit))}
                  </Box>                
                </HStack>                       
              </Stack>
          </CardBody>
        </Card>      
    </>
  );
}
