import React, { useEffect, useState } from "react";
import { projectService, userService } from "../../services";
import { Box, Card, CardBody, CardHeader, HStack, Select, Stack } from "@chakra-ui/react";
import BudgetChart from "./project/charts/budgetChart";
import InvoiceChart from "./project/charts/invoiceChart";
import ExpenseChart from "./project/charts/expenseChart";
import FinancialSummary from "./project/financialSummary";
import { useDispatch, useSelector } from "react-redux";


export default function AccountDashboard(props) {
  const dispatch = useDispatch();

  const [project, setProject] = useState();
  const [displayProjectSelection, setDisplayProjectSelection] = useState(false)
  const accountId = userService.getAccountDetails().accountId
  // const projectId = "209"

  useEffect(() => {
  }, []);
  


  async function getProjectBudgetDetails(projectIdInput) {
    console.log("projectIdInput::"+projectIdInput)
    const responseData = await projectService.getProjectBudgetDetails(projectIdInput, userService.getAccountDetails().accountId);
    console.log("responseData::"+JSON.stringify(responseData))
    setProject(responseData)
  }


return (
    <>    
    <Stack>
        <HStack>
          <Card variant="projectReportsHeader">
            <CardHeader>
              <HStack>
                {accountId
                ?<Box fontWeight="semibold">{accountId}</Box>
                :(
                    <></>
                  )
                }      
              </HStack>     
            </CardHeader>
          </Card>
        </HStack>
              <HStack>

              </HStack>
      </Stack>
    </>
  );
}
