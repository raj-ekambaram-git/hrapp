import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";
import { ExpenseStatus } from "@prisma/client";
import RevenueBySummarySection from "../../common/revenueBySummarySection";
import VendorsByStatusSummarySection from "../../common/vendorsByStatusSummarySection";



export default function RevenueByVendors(props) {
  const [totalEstimatedRevenue, setTotalEstimatedRevenue] = useState(0);
  const [totalActualRevenue, setTotalActualRevenue] = useState(0);
  const [totalProjectCost, setTotalProjectCost] = useState(0);
  const [totalBillableExp, setTotalBillableExp] = useState(0);
  const [totalNonBillableExp, setTotalNonBillableExp] = useState(0);
  const [totalNetProfit, setTotalNetProfit] = useState(0);
  const [allVendors, setAllVendors] = useState([]);

  

  useEffect(() => {
    if(props.vendors && props.vendors.length > 0) {      
      getProjetsRevenueData()
    }else {
      removeChart()
    }
  }, [props.vendors, props.canvasId]);

  function getProjetsRevenueData(){
    removeChart()


    let allVendorEstimatedRevenue = 0;
    let allVendorActualRevenue = 0;
    let allVendorCost = 0;
    let allVendorBillableExp = 0;
    let allVendorNonBillableExp = 0;
    let allVendorNetProfit = 0;

    const labels = []; 
    const vendorTotalBudget = []; 
    const vendorUsedBudget = []; 
    const vendorNetProfit = []; 
    const vendorResourceCost = [];
    const vendorBillableExpense = [];
    const vendorNonBillableExpense = [];

    props.vendors?.map(vendor => {
      let allProjectEstimatedRevenue = 0;
      let allProjectActualRevenue = 0;
      let allProjectCost = 0;
      let allProjectBillableExp = 0;
      let allProjectNonBillableExp = 0;
      let allProjectNetProfit = 0;
      
      allVendors.push({id: vendor?.id, name: vendor?.name, status: vendor?.status})

      labels.push((vendor?.name?.length>25?vendor?.name?.substring(0,25):vendor?.name))

      vendor.project?.map(project => {        
        allProjectEstimatedRevenue = allProjectEstimatedRevenue +(parseFloat(project.budget)+parseFloat(project.miscBudget))
        allProjectActualRevenue = allProjectActualRevenue+(parseFloat(project.usedBudget)+parseFloat(project.usedMiscBudget))

        //Total Project Cost
        let totalResourceCost = 0;
        project.projectResource?.map(resource => {
          totalResourceCost = parseFloat(totalResourceCost)+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
        })
        
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
        allProjectBillableExp = allProjectBillableExp+totalBillableExp;
        allProjectNonBillableExp = allProjectNonBillableExp+totalNonBillableExp;

        //Net profit: totalRevenue-(projectCost+billableExpense+nonBillableExpense)
        let totalNetProfit = 0
        totalNetProfit = (parseFloat(project.usedBudget)+parseFloat(project.usedMiscBudget))-(totalResourceCost+totalBillableExp+totalNonBillableExp)
        
        allProjectNetProfit = allProjectNetProfit+totalNetProfit;
      })

        vendorTotalBudget.push(allProjectEstimatedRevenue)
        allVendorEstimatedRevenue = allVendorEstimatedRevenue+allProjectEstimatedRevenue;
        vendorUsedBudget.push(allProjectActualRevenue)
        allVendorActualRevenue = allVendorActualRevenue+allProjectActualRevenue;
        vendorResourceCost.push(allProjectCost)
        allVendorCost = allVendorCost+allProjectCost
        vendorBillableExpense.push(allProjectBillableExp)
        allVendorBillableExp = allVendorBillableExp+allProjectBillableExp
        vendorNonBillableExpense.push(allProjectNonBillableExp)
        allVendorNonBillableExp = allVendorNonBillableExp+allProjectNonBillableExp
        vendorNetProfit.push(allProjectNetProfit)
        allVendorNetProfit = allVendorNetProfit+allProjectNetProfit


    })

    setTotalActualRevenue(allVendorActualRevenue)
    setTotalEstimatedRevenue(allVendorEstimatedRevenue)
    setTotalProjectCost(allVendorCost)
    setTotalBillableExp(allVendorBillableExp)
    setTotalNonBillableExp(allVendorNonBillableExp)
    setTotalNetProfit(allVendorNetProfit)

    
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Estimated Revenue',
          data: vendorTotalBudget,
        },
        {
          label: 'Revenue',
          data: vendorUsedBudget,
        },
        {
          label: 'Resource Cost',
          data: vendorResourceCost,
        },       
        {
          label: 'Billable Expense',
          data: vendorBillableExpense,
        },   
        {
          label: 'Non-Billable Expense',
          data: vendorNonBillableExpense,
        },                    
        {
          label: 'Net Profit',
          data: vendorNetProfit,
        },        
      ]
    };

    const subtitle = {
      display: true,
      text: "Total Revenue: $"+util.getZeroPriceForNull(allVendorActualRevenue),
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
      titleText: 'Estimated Total Revenue: $'+(util.getZeroPriceForNull(allVendorEstimatedRevenue)), 
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
                      By Vendors
              </Box>
              <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <HStack>
              <Box width="60%">
                <canvas id={props.canvasId}></canvas>
              </Box>  
              <HStack width="60%">
                <RevenueBySummarySection totalEstimatedRevenue={totalEstimatedRevenue} totalActualRevenue={totalActualRevenue} totalProjectCost={totalProjectCost}
                                          totalBillableExp={totalBillableExp} totalNonBillableExp={totalNonBillableExp} totalNetProfit={totalNetProfit}/>
                <VendorsByStatusSummarySection vendors={allVendors}/>

              </HStack> 
            </HStack>            
          </AccordionPanel>   
      </AccordionItem>          

    </>
  );
}
