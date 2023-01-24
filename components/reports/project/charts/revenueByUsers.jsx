import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";
import { horizontalBarChart } from "../../../common/charts/horizontalBarChart";



export default function RevenueByUsers(props) {

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
    props.projectResource?.map(resource => {
      labels.push((resource.user?.firstName.length>5?resource.user?.firstName.substring(0,5):resource.user?.firstName)+" "+(resource.user?.lastName.length>5?resource.user?.lastName.substring(0,5):resource.user?.lastName))
      allocatedBudget.push(util.getZeroPriceForNull(resource.budgetAllocated))
      usedBudget.push(util.getZeroPriceForNull(resource.usedBudget))
    })
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
        
      ]
    };
    

    horizontalBarChart({
      canvasId:"revenueByUser", 
      chartData: data, 
      titleText: 'Total Budget: $'+(util.getZeroPriceForNull(props.budget)+" Used Budget: $"+util.getZeroPriceForNull(props.usedBudget)), 
      // titleText: <></>,
      position:'top'})
  }
  

  return (
    <>    
      <Box width="60%">
        <canvas id="revenueByUser"></canvas>
      </Box>        
    </>
  );
}
