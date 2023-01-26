import React, { useEffect } from "react";
import { Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { util } from "../../../helpers/util";


export default function RevenueByUsersSummarySection(props) {

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
                  <Box width="50%" textAlign="right">
                    Total Available Budget:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(props.allProjectsBudget)}
                  </Box>                
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Allocated Budget:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                    {util.getWithCurrency(props.allProjectAllocatedBudget)}
                  </Box>                
                </HStack>                           
                <HStack>
                  <Box width="50%" textAlign="right">
                    Remaining Budget to allocate:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                    {util.getWithCurrency(props.allProjectsBudget-props.allProjectAllocatedBudget)}
                  </Box>                
                </HStack>                           
                <HStack>
                  <Box width="50%" textAlign="right">
                    Used Budget:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(props.allProjectsUsedBudget)}
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="50%" textAlign="right">
                    Resource Cost:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                    {util.getWithCurrency(props.allProjectsTotalResourceCost)}
                  </Box>                
                </HStack>                  
                <HStack>
                  <Box width="50%" textAlign="right" fontWeight="semibold" fontStyle="italic">
                    Net Profit:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={(util.getZeroPriceForNull(props.allProjectsUsedBudget)-util.getZeroPriceForNull(props.allProjectsTotalResourceCost)) > 0 ? 'debit_amount':""}>
                    {util.getWithCurrency((util.getZeroPriceForNull(props.allProjectsUsedBudget)-util.getZeroPriceForNull(props.allProjectsTotalResourceCost)))}
                  </Box>                
                </HStack>                       
              </Stack>
          </CardBody>
        </Card>  

    </>
  );
}
