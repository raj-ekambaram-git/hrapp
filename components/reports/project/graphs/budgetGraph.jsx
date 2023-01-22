import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";



export default function BudgetGraph(props) {

  useEffect(() => {
    console.log("BudgetGraph.selectedReport::"+JSON.stringify(props.project))
    if(props.project) {
      budgetData();
    }    
  }, []);
  


  function budgetData() {


    const data = [
      { key: "Used $"+props.project?.usedBudget, value: props.project?.usedBudget },
      { key: "Remaining $"+(util.getZeroPriceForNull(props.project?.budget)-props.project?.usedBudget), value: (util.getZeroPriceForNull(props.project?.budget)-props.project?.usedBudget) },
    ];
    let chartStatus = Chart.getChart("budgetChart"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const budgetChart = new Chart(
      document.getElementById('budget'),
      {
        type: 'doughnut',
        data: {
          labels: data.map(row => row.key),
          datasets: [
            {
              data: data.map(row => row.value)
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Total Budget: $'+util.getZeroPriceForNull(props.project?.budget)
            }
          }
        }
      }
    );
    
  }

  return (
    <>    
        <canvas id="budget"></canvas>
        <canvas id="invoice"></canvas>
    </>
  );
}
