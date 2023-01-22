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
        <Box maxW="20%">
            {project? (
              <HStack>
                <BudgetGraph project={project}/>
                <InvoiceGraph project={project}/>
              </HStack>
            ):(<></>)}
            <canvas id="invoice"></canvas>
        </Box>
      </Stack>
    </>
  );
}
