import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";
import { ExpenseStatus } from "@prisma/client";
import RevenueBySummarySection from "../../common/revenueBySummarySection";
import ProjectsByStatusSummarySection from "../../common/projectsByStatusSummarySection";



export default function RevenueByProjects(props) {
  const [totalEstimatedRevenue, setTotalEstimatedRevenue] = useState(0);
  const [totalActualRevenue, setTotalActualRevenue] = useState(0);
  const [totalProjectCost, setTotalProjectCost] = useState(0);
  const [totalBillableExp, setTotalBillableExp] = useState(0);
  const [totalNonBillableExp, setTotalNonBillableExp] = useState(0);
  const [totalNetProfit, setTotalNetProfit] = useState(0);
  const [allProjects, setAllProjects] = useState([]);

  

  useEffect(() => {
    if(props.vendors && props.vendors.length > 0) {      
      getProjetsRevenueData()
    }else {
      removeChart()
    }
  }, [props.vendors, props.canvasId]);

  function getProjetsRevenueData(){
    removeChart()


    let allProjectEstimatedRevenue = 0;
    let allProjectActualRevenue = 0;
    let allProjectCost = 0;
    let allProjectBillableExp = 0;
    let allProjectNonBillableExp = 0;
    let allProjectNetProfit = 0;

    const labels = []; 
    const projectTotalBudget = []; 
    const projectUsedBudget = []; 
    const projectNetProfit = []; 
    const projectResourceCost = [];
    const projectBillableExpense = [];
    const projectNonBillableExpense = [];

    props.vendors?.map(vendor => {
      vendor.project?.map(project => {
        allProjects.push({id: project?.id, name: project?.name, status: project?.status})

        labels.push((project?.name?.length>25?project?.name?.substring(0,25):project?.name)+"-"+project?.referenceCode)
        allProjectEstimatedRevenue = allProjectEstimatedRevenue +(parseFloat(project.budget)+parseFloat(project.miscBudget))
        allProjectActualRevenue = allProjectActualRevenue+(parseFloat(project.usedBudget)+parseFloat(project.usedMiscBudget))
        projectTotalBudget.push(parseFloat(project.budget)+parseFloat(project.miscBudget))
        projectUsedBudget.push(parseFloat(project.usedBudget)+parseFloat(project.usedMiscBudget))

        //Total Project Cost
        let totalResourceCost = 0;
        project.projectResource?.map(resource => {
          totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
        })
        projectResourceCost.push(totalResourceCost)
        allProjectCost = allProjectCost+totalResourceCost;

        //Total Billable and Non-Billable Expense
        let totalBillableExp = 0;
        let totalNonBillableExp = 0;
        project.expense?.map(exp => {
          if((exp.status != ExpenseStatus.Submitted && exp.status != ExpenseStatus.Draft)) {
            const expenseAmounts = util.getTotalBillableExpense(exp.expenseEntries);
            totalBillableExp = totalBillableExp+expenseAmounts?.billableExpense;
            totalNonBillableExp = totalNonBillableExp+expenseAmounts?.nonBillableExpense;
          }              
        })
        projectBillableExpense.push(totalBillableExp)
        projectNonBillableExpense.push(totalNonBillableExp)
        allProjectBillableExp = allProjectBillableExp+totalBillableExp;
        allProjectNonBillableExp = allProjectNonBillableExp+totalNonBillableExp;

        //Net profit: totalRevenue-(projectCost+billableExpense+nonBillableExpense)
        let totalNetProfit = 0
        totalNetProfit = (parseFloat(project.usedBudget)+parseFloat(project.usedMiscBudget))-(totalResourceCost+totalBillableExp+totalNonBillableExp)
        projectNetProfit.push(totalNetProfit)
        allProjectNetProfit = allProjectNetProfit+totalNetProfit;
      })
    })      

    setTotalActualRevenue(allProjectActualRevenue)
    setTotalEstimatedRevenue(allProjectEstimatedRevenue)
    setTotalProjectCost(allProjectCost)
    setTotalBillableExp(allProjectBillableExp)
    setTotalNonBillableExp(allProjectNonBillableExp)
    setTotalNetProfit(allProjectNetProfit)

    
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Estimated Revenue',
          data: projectTotalBudget,
        },
        {
          label: 'Revenue',
          data: projectUsedBudget,
        },
        {
          label: 'Resource Cost',
          data: projectResourceCost,
        },       
        {
          label: 'Billable Expense',
          data: projectBillableExpense,
        },   
        {
          label: 'Non-Billable Expense',
          data: projectNonBillableExpense,
        },                    
        {
          label: 'Net Profit',
          data: projectNetProfit,
        },        
      ]
    };

    const subtitle = {
      display: true,
      text: "Total Revenue: $"+util.getZeroPriceForNull(allProjectActualRevenue),
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
      titleText: 'Estimated Total Revenue: $'+(util.getZeroPriceForNull(allProjectEstimatedRevenue)), 
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
                      By Projects
              </Box>
              <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack>
              <Box width="60%">
                <canvas id={props.canvasId}></canvas>
              </Box>  
              <Stack width="50%">
                <HStack>
                  <RevenueBySummarySection totalEstimatedRevenue={totalEstimatedRevenue} totalActualRevenue={totalActualRevenue} totalProjectCost={totalProjectCost}
                                              totalBillableExp={totalBillableExp} totalNonBillableExp={totalNonBillableExp} totalNetProfit={totalNetProfit}/>
                  <ProjectsByStatusSummarySection projects={allProjects}/>
                </HStack>
              </Stack> 
            </HStack>            
          </AccordionPanel>   
      </AccordionItem>          

    </>
  );
}
