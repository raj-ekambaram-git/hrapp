import React, { useEffect } from "react";
import { projectService, userService } from "../../services";
import Chart from 'chart.js/auto'
import { Box } from "@chakra-ui/react";
import { util } from "../../helpers/util";


export default function ProjectDashboard(props) {

  const projectId = parseInt("2");


  useEffect(() => {
    console.log("ProjectDashboard.selectedReport::")
    getProjectBudgetDetails();
  }, []);
  
  async function getProjectBudgetDetails() {
    const responseData = await projectService.getProjectBudgetDetails(projectId, userService.getAccountDetails().accountId);

    console.log("responseData:::"+JSON.stringify(responseData))

    let usedBudget = 0;
    responseData.invoice?.map(inv => usedBudget = parseFloat(usedBudget)+parseFloat(inv.total))
    console.log("usedBudget:::"+usedBudget)


    const data = [
      { key: "Used $"+usedBudget, value: usedBudget },
      { key: "Remaining $"+(util.getZeroPriceForNull(responseData.budget)-usedBudget), value: (util.getZeroPriceForNull(responseData.budget)-usedBudget) },
    ];

    const chart = new Chart(
      document.getElementById('projectBudget'),
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
              text: 'Project Budget: $'+util.getZeroPriceForNull(responseData.budget)
            }
          }
        }
      }
    );

  }

  return (
    <>    
      <Box maxW="25%">
          <canvas id="projectBudget"></canvas>
          <canvas id="projectBudget"></canvas>
      </Box>
    </>
  );
}
