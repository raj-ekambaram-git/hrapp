import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function BudgetChart(props) {

  useEffect(() => {
    if(props.budget && props.usedBudget) {
      getBudgetData();
    }
  }, []);

  if(props.budget && props.usedBudget) {
    getBudgetData();
  }

  function getBudgetData(){
    let chartStatus = Chart.getChart("budget"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const data = [
      { key: "Used $"+props.usedBudget, value: props.usedBudget },      
      { key: "Rem $"+(util.getZeroPriceForNull(props.budget)-props.usedBudget), value: (util.getZeroPriceForNull(props.budget)-props.usedBudget) },      
    ];

    if(util.getZeroPriceForNull(props.miscBudget)>0) {
      data.push({ key: "Used Misc Budget $"+props.usedMiscBudget, value: props.usedMiscBudget})
      data.push({ key: "Rem Misc $"+(util.getZeroPriceForNull(props.miscBudget)-props.usedMiscBudget), value: (util.getZeroPriceForNull(props.miscBudget)-props.usedMiscBudget)})
    }


    doughnutChart({
      canvasId:"budget", 
      chartData: data, 
      titleText: 'Total Budget: $'+(util.getZeroPriceForNull(props.budget)+util.getZeroPriceForNull(props.miscBudget)), 
      position:'top'})
  }
  

  return (
    <>    
      <Box width="25%">
        <canvas id="budget"></canvas>
      </Box>        
    </>
  );
}
