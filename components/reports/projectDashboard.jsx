import React, { useEffect, useState } from "react";
import { projectService, userService } from "../../services";
import { Box, HStack, Stack } from "@chakra-ui/react";
import BudgetChart from "./project/charts/budgetChart";
import InvoiceChart from "./project/charts/invoiceChart";
import ExpenseChart from "./project/charts/expenseChart";
import FinancialSummary from "./project/financialSummary";


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
\            {project? (
              <HStack>
                <BudgetChart budget={project.budget} usedBudget={project.usedBudget}/>
                <InvoiceChart invoice={project.invoice}/>
                <ExpenseChart expense={project.expense}/>
                <FinancialSummary project={project}/>
              </HStack>
            ):(<></>)}                    
      </Stack>
    </>
  );
}
