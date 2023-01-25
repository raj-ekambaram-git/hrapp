import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";



export default function RevenueByUsers(props) {
  const [allProjectsTotalResourceCost, setAllProjectsTotalResourceCost] = useState(0);
  const [allProjectsBudget, setAllProjectsBudget] = useState(0);
  const [allProjectsUsedBudget, setAllProjectsUsedBudget] = useState(0);
  const [allProjectsRemainBudgetToAllocate, setAllProjectsRemainBudgetToAllocate] = useState(0);

  useEffect(() => {
    if(props.projects && props.projects.length > 0) {      
      getUsersRevenueData()
    }else {
      removeChart()
    }
  }, [props.projects]);

  function getUsersRevenueData(){
    removeChart()

    const labels = []; 
    const allocatedBudget = []; 
    const usedBudget = []; 
    const userRevenue = []; 
    let totalResourceCost = 0;
    let totalRemainingBudgetToAllocate = 0;
    let totalUsedBudget = 0;
    let totalBudget = 0;

    props.projects?.map(project => {
      totalRemainingBudgetToAllocate = totalRemainingBudgetToAllocate+util.getZeroPriceForNull(project.remainingBudgetToAllocate)
      totalUsedBudget = totalUsedBudget+util.getZeroPriceForNull(project.usedBudget)
      totalBudget = totalBudget+util.getZeroPriceForNull(project.budget)
      project.projectResource?.map(resource => {
        labels.push((resource.user?.firstName.length>5?resource.user?.firstName.substring(0,5):resource.user?.firstName)+" "+(resource.user?.lastName.length>5?resource.user?.lastName.substring(0,5):resource.user?.lastName))
        allocatedBudget.push(util.getZeroPriceForNull(resource.budgetAllocated))
        usedBudget.push(util.getZeroPriceForNull(resource.usedBudget))
        totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
        userRevenue.push((util.getZeroPriceForNull(resource.usedBudget)-((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))))
      })

    })

    setAllProjectsBudget(totalBudget)
    setAllProjectsUsedBudget(totalUsedBudget)
    setAllProjectsRemainBudgetToAllocate(totalRemainingBudgetToAllocate)

    setAllProjectsTotalResourceCost(totalResourceCost)
    
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
      text: "Used Budget: $"+util.getZeroPriceForNull(totalUsedBudget),
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
      canvasId:"revenueByVendorUser", 
      chartData: data, 
      titleText: 'Total Budget: $'+(util.getZeroPriceForNull(totalBudget)), 
      subtitleData: subtitle,
      position:'top',
      })
  }


  const removeChart = () => {
    let chartStatus = Chart.getChart("revenueByVendorUser"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  }
  

  return (
    <>    

      <Box width="60%">
        <canvas id="revenueByVendorUser"></canvas>
      </Box>  
      <Stack width="50%">
        <Card variant="projectUsersFinancialSummary">
          <CardHeader>
            <Heading size='xs' textAlign="center">All Users Summary as of {util.getFormattedDate(new Date())}</Heading>          
          </CardHeader>
          <CardBody>
              <Stack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Total Available Budget:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(allProjectsBudget)}
                  </Box>                
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Used Budget:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(allProjectsUsedBudget)}
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="50%" textAlign="right">
                    Total Resource Cost:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                    {util.getWithCurrency(allProjectsTotalResourceCost)}
                  </Box>                
                </HStack>                  
                <HStack>
                  <Box width="50%" textAlign="right">
                    Net Revenue:
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={(util.getZeroPriceForNull(allProjectsUsedBudget)-util.getZeroPriceForNull(allProjectsTotalResourceCost)) > 0 ? 'debit_amount':""}>
                    {util.getWithCurrency((util.getZeroPriceForNull(allProjectsUsedBudget)-util.getZeroPriceForNull(allProjectsTotalResourceCost)))}
                  </Box>                
                </HStack>                       
              </Stack>
          </CardBody>
        </Card>  
        {/* <Card variant="projectUsersFinancialSummary">
          <CardHeader>
            <Heading size='xs' textAlign="center">Users Summary as of {util.getFormattedDate(new Date())}</Heading>          
          </CardHeader>
          <CardBody>
              <Stack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Total Budget:
                  </Box>
                  <Box>
                    $ 100
                  </Box>                
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Allocated Budget:
                  </Box>
                  <Box>
                    $ 100
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="50%" textAlign="right">
                    Used Budget:
                  </Box>
                  <Box>
                    $ 100
                  </Box>                
                </HStack>   
                <HStack>
                  <Box width="50%" textAlign="right">
                    Net Revenue:
                  </Box>
                  <Box>
                    $ 100
                  </Box>                
                </HStack>                       
              </Stack>
          </CardBody>
        </Card>           */}
      </Stack> 
    </>
  );
}
