import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function BudgetChart(props) {
  

  useEffect(() => {
    if(props.projects && props.projects.length > 0) {
      getBudgetData();
    }else {
      removeChart();
    }
  }, [props.projects, props.canvasId]);

  function getBudgetData(){
    removeChart();



    let totalBudget = 0;
    let totalUsedBudget = 0;
    let totalMiscBudget = 0;
    let totalMiscUsedBudget = 0;

    props.projects?.map(project => {
      totalBudget = totalBudget+util.getZeroPriceForNull(project.budget)
      totalUsedBudget = totalUsedBudget+util.getZeroPriceForNull(project.usedBudget)
      totalMiscBudget = totalMiscBudget+util.getZeroPriceForNull(project.miscBudget)
      totalMiscUsedBudget = totalMiscUsedBudget+util.getZeroPriceForNull(project.usedMiscBudget)
      
    })

    const data = [
      { key: "Used $"+totalUsedBudget, value: totalUsedBudget },      
      { key: "Rem $"+(util.getZeroPriceForNull(totalBudget)-totalUsedBudget), value: (util.getZeroPriceForNull(totalBudget)-totalUsedBudget) },      
    ];

    if(util.getZeroPriceForNull(totalMiscBudget)>0) {
      data.push({ key: "Used Misc Budget $"+totalMiscUsedBudget, value: totalMiscUsedBudget})
      data.push({ key: "Rem Misc $"+(util.getZeroPriceForNull(totalMiscBudget)-totalMiscUsedBudget), value: (util.getZeroPriceForNull(totalMiscBudget)-totalMiscUsedBudget)})
    }


    doughnutChart({
      canvasId: props.canvasId, 
      chartData: data, 
      titleText: 'Total Budget: $'+(util.getZeroPriceForNull(totalBudget)+util.getZeroPriceForNull(totalMiscBudget)), 
      position:'top'})
  }

  const removeChart = () => {
    let chartStatus = Chart.getChart(props.canvasId); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  }
  

  return (
    <>    
      <Box width="25%">
        <canvas id={props.canvasId}></canvas>
      </Box>        
    </>
  );
}
