import React, { useEffect, useState } from "react";
import { projectService, userService } from "../../services";
import { Box, HStack, Stack } from "@chakra-ui/react";
import BudgetChart from "./project/charts/budgetChart";
import InvoiceChart from "./project/charts/invoiceChart";


export default function ProjectDashboard(props) {
  const [project, setProject] = useState();
  const projectId = parseInt("209");


  useEffect(() => {
    console.log("ProjectDashboard.selectedReport::")
    getProjectBudgetDetails();
  }, []);
  
  async function getProjectBudgetDetails() {
    const responseData = await projectService.getProjectBudgetDetails(projectId, userService.getAccountDetails().accountId);
    console.log("responseData:::"+JSON.stringify(responseData))
    setProject(responseData)
  }

return (
    <>    
    <Stack>
        <HStack>

        </HStack>
        <Box width="20%">
            {project? (
              <HStack>
                <BudgetChart budget={project.budget} usedBudget={project.usedBudget}/>
                <InvoiceChart invoice={project.invoice}/>
              </HStack>
            ):(<></>)}
            <canvas id="invoice"></canvas>
        </Box>
      </Stack>
    </>
  );
}
