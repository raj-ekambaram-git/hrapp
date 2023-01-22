import React, { useEffect, useState } from "react";
import { projectService, userService } from "../../services";
import { Box, HStack, Stack } from "@chakra-ui/react";
import BudgetGraph from "./project/graphs/budgetGraph";
import InvoiceGraph from "./project/graphs/invoiceGraph";


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
                <BudgetGraph budget={project.budget} usedBudget={project.usedBudget}/>
                <InvoiceGraph invoice={project.invoice}/>
              </HStack>
            ):(<></>)}
            <canvas id="invoice"></canvas>
        </Box>
      </Stack>
    </>
  );
}
