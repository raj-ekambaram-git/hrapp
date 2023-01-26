import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";



export default function RevenueByUsers(props) {
  const [allProjectsTotalResourceCost, setAllProjectsTotalResourceCost] = useState(0);
  const [allProjectsBudget, setAllProjectsBudget] = useState(0);
  const [allProjectsUsedBudget, setAllProjectsUsedBudget] = useState(0);
  const [allProjectsRemainBudgetToAllocate, setAllProjectsRemainBudgetToAllocate] = useState(0);
  const [allProjectAllocatedBudget, setAllProjectAllocatedBudget] = useState(0);

  useEffect(() => {
    if(props.vendors && props.vendors.length > 0) {      
      getUsersRevenueData()
    }else {
      removeChart()
    }
  }, [props.vendors, props.canvasId]);

  function getUsersRevenueData(){
    removeChart()

    const labels = []; 
    const allocatedBudget = []; 
    const usedBudget = []; 
    const userRevenue = []; 
    const userCost = []; 
    const userTrackingArray = []; 
    let totalResourceCost = 0;
    let totalRemainingBudgetToAllocate = 0;
    let totalAllocatedBudget = 0;
    let totalUsedBudget = 0;
    let totalBudget = 0;

    props.vendors?.map(vendor => {
      vendor.project?.map(project => {
        totalRemainingBudgetToAllocate = totalRemainingBudgetToAllocate+util.getZeroPriceForNull(project.remainingBudgetToAllocate)
        totalUsedBudget = totalUsedBudget+util.getZeroPriceForNull(project.usedBudget)
        totalBudget = totalBudget+util.getZeroPriceForNull(project.budget)
        project.projectResource?.map(resource => {
          if(userTrackingArray.includes(resource.userId)) {
            const indexWhereUserPresent = userTrackingArray.findIndex(x => x === resource.userId);
            allocatedBudget[indexWhereUserPresent] = (util.getZeroPriceForNull(allocatedBudget[indexWhereUserPresent])+util.getZeroPriceForNull(resource.budgetAllocated))
            totalAllocatedBudget = totalAllocatedBudget+util.getZeroPriceForNull(resource.budgetAllocated);
            usedBudget[indexWhereUserPresent] = (util.getZeroPriceForNull(usedBudget[indexWhereUserPresent])+util.getZeroPriceForNull(resource.usedBudget))
            userCost.push((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
            totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
            userRevenue[indexWhereUserPresent] = (userRevenue[indexWhereUserPresent] +(util.getZeroPriceForNull(resource.usedBudget)-((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))))
            userRevenue.push()    
          }else {
            userTrackingArray.push(resource.userId)
            labels.push((resource.user?.firstName.length>5?resource.user?.firstName.substring(0,5):resource.user?.firstName)+" "+(resource.user?.lastName.length>5?resource.user?.lastName.substring(0,5):resource.user?.lastName))
            allocatedBudget.push(util.getZeroPriceForNull(resource.budgetAllocated))
            totalAllocatedBudget = totalAllocatedBudget+util.getZeroPriceForNull(resource.budgetAllocated);
            usedBudget.push(util.getZeroPriceForNull(resource.usedBudget))
            userCost.push((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
            totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
            userRevenue.push((util.getZeroPriceForNull(resource.usedBudget)-((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))))    
          }

        })

      })
    })

    console.log("userRevenue:::"+userRevenue)
    setAllProjectsBudget(totalBudget)
    setAllProjectsUsedBudget(totalUsedBudget)
    setAllProjectsRemainBudgetToAllocate(totalRemainingBudgetToAllocate)
    setAllProjectAllocatedBudget(totalAllocatedBudget)

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
          label: 'Cost',
          data: userCost,
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
      canvasId: props.canvasId, 
      chartData: data, 
      titleText: 'Total Budget: $'+(util.getZeroPriceForNull(totalBudget)), 
      subtitleData: subtitle,
      position:'top',
      })
  }


  const removeChart = () => {
    let chartStatus = Chart.getChart(props.canvasId); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
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
                <canvas id={props.canvasId}></canvas>
              </Box>  
              <Stack width="70%">
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
                            {util.getWithCurrency(allProjectsBudget)}
                          </Box>                
                        </HStack>
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Allocated Budget:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                            {util.getWithCurrency(allProjectAllocatedBudget)}
                          </Box>                
                        </HStack>                           
                        <HStack>
                          <Box width="50%" textAlign="right">
                            Remaining Budget to allocate:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                            {util.getWithCurrency(allProjectsBudget-allProjectAllocatedBudget)}
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
                            Resource Cost:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color="credit_amount">
                            {util.getWithCurrency(allProjectsTotalResourceCost)}
                          </Box>                
                        </HStack>                  
                        <HStack>
                          <Box width="50%" textAlign="right" fontWeight="semibold" fontStyle="italic">
                            Net Profit:
                          </Box>
                          <Box width="50%" textAlign="left" fontWeight="semibold" color={(util.getZeroPriceForNull(allProjectsUsedBudget)-util.getZeroPriceForNull(allProjectsTotalResourceCost)) > 0 ? 'debit_amount':""}>
                            {util.getWithCurrency((util.getZeroPriceForNull(allProjectsUsedBudget)-util.getZeroPriceForNull(allProjectsTotalResourceCost)))}
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
