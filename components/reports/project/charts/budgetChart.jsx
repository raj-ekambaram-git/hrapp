import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function BudgetChart(props) {
  useEffect(() => {
    if(props.budget && props.usedBudget) {
      budgetData();
    }    
  }, []);
  


  function budgetData() {
    const data = [
      { key: "Used $"+props.usedBudget, value: props.usedBudget },
      { key: "Remaining $"+(util.getZeroPriceForNull(props.budget)-props.usedBudget), value: (util.getZeroPriceForNull(props.budget)-props.usedBudget) },
    ];
    let chartStatus = Chart.getChart("budget"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    doughnutChart({
      canvasId:"budget", 
      chartData: data, 
      titleText: 'Total Budget: $'+util.getZeroPriceForNull(props.budget), 
      position:'top'})
    
  }

  return (
    <>    
      <Box width="20%">
        <canvas id="budget"></canvas>
      </Box>        
    </>
  );
}
