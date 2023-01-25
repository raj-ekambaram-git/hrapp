import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";



export default function RevenueByUsers(props) {
  const [totalResourceCost, setTotalResourceCost] = useState(0);

  useEffect(() => {
    if(props.projectResource && props.projectResource?.length>0) {
      getUsersRevenueData();
    }
  }, [props.projectResource]);

  function getUsersRevenueData(){
    let chartStatus = Chart.getChart("revenueByUser"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const labels = []; 
    const allocatedBudget = []; 
    const usedBudget = []; 
    const userRevenue = []; 
    let totalResourceCost = 0;
    props.projectResource?.map(resource => {
      labels.push((resource.user?.firstName.length>5?resource.user?.firstName.substring(0,5):resource.user?.firstName)+" "+(resource.user?.lastName.length>5?resource.user?.lastName.substring(0,5):resource.user?.lastName))
      allocatedBudget.push(util.getZeroPriceForNull(resource.budgetAllocated))
      usedBudget.push(util.getZeroPriceForNull(resource.usedBudget))
      totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
      userRevenue.push((util.getZeroPriceForNull(resource.usedBudget)-((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))))
    })

    setTotalResourceCost(totalResourceCost)
    
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Allocated Budget',
          data: allocatedBudget,
        },
        {
          label: 'Used Budget',
          data: usedBudget,
        },
        {
          label: 'Net Revenue',
          data: userRevenue,
        },        
      ]
    };

    const subtitle = {
      display: true,
      text: "Used Budget: $"+util.getZeroPriceForNull(props.usedBudget),
      color: 'blue',
      font: {
        size: 12,
        family: 'tahoma',
        weight: 'normal',
        style: 'italic'
      },
      padding: {
        bottom: 10
      }
    }

    horizontalBarChart({
      canvasId:"revenueByUser", 
      chartData: data, 
      titleText: 'Total Available Budget: $'+(util.getZeroPriceForNull(props.budget)), 
      subtitleData: subtitle,
      position:'top',
      })
  }
  

  return (
    <>    
      <AccordionItem>
          <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                      By Users
              </Box>
              <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack>

              <Box width="60%">
                <canvas id="revenueByUser"></canvas>
              </Box>  
              <Stack width="70%">
                <Card variant="projectUsersFinancialSummary">
                  <CardHeader>
                    <Heading size='xs' textAlign="center">All Users Summary as of {util.getFormattedDate(new Date())}</Heading>          
                  </CardHeader>
                  <CardBody>
                      <Stack>
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Available Budget:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold">
                            {util.getWithCurrency(props.budget)}
                          </Box>                
                        </HStack>
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Allocated Budget:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                            {util.getWithCurrency(props.budget-props.remainingBudgetToAllocate)}
                          </Box>                
                        </HStack>                           
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Remaining Budget to allocate:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                            {util.getWithCurrency(props.remainingBudgetToAllocate)}
                          </Box>                
                        </HStack>   
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Used Budget:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold">
                            {util.getWithCurrency(props.usedBudget)}
                          </Box>                
                        </HStack>   
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Resource Cost:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                            {util.getWithCurrency(totalResourceCost)}
                          </Box>                
                        </HStack>                  
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Net Profit:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color={(util.getZeroPriceForNull(props.usedBudget)-util.getZeroPriceForNull(totalResourceCost)) > 0 ? 'debit_amount':""}>
                            {util.getWithCurrency((util.getZeroPriceForNull(props.usedBudget)-util.getZeroPriceForNull(totalResourceCost)))}
                          </Box>                
                        </HStack>                       
                      </Stack>
                  </CardBody>
                </Card>  
              </Stack> 
            </HStack>

          </AccordionPanel>   
      </AccordionItem>    
    </>
  );
}
