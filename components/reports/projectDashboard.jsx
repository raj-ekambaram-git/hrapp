import React, { useEffect, useState } from "react";
import { projectService, userService } from "../../services";
import { Box, Card, CardBody, CardHeader, HStack, Select, Stack } from "@chakra-ui/react";
import BudgetChart from "./project/charts/budgetChart";
import InvoiceChart from "./project/charts/invoiceChart";
import ExpenseChart from "./project/charts/expenseChart";
import FinancialSummary from "./project/financialSummary";
import { useDispatch, useSelector } from "react-redux";
import RevenueByUsers from "./project/charts/revenueByUsers";


export default function ProjectDashboard(props) {
  const dispatch = useDispatch();

  const [project, setProject] = useState();
  const [displayProjectSelection, setDisplayProjectSelection] = useState(false)
  const [projectList, setProjectList] = useState([])
  const projectId = useSelector(state => state.reports.selectedReportsProjectId);
  // const projectId = "209"

  useEffect(() => {
    if(projectId) {
      getProjectBudgetDetails(projectId);
    }else {
      getProjectForUser(userService.userValue.id);
    }
    
  }, []);
  
  async function getProjectForUser(userId) {
    const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
    setProjectList(projectsForUserResponse);
}

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
                {projectId
                ?<Box fontWeight="semibold">{project?.name}</Box>
                :(
                    <></>
                  )
                }    
                <Select bgColor="white" width="30%" onChange={(ev) => getProjectBudgetDetails(ev.target.value)} value={projectId}>
                  <option value="">Select Project</option>
                  {projectList?.map((project) => (
                          <option value={project.projectId}>{project.project?.name} - {project.project?.referenceCode}</option>
                    ))}                                  
                </Select>    
              </HStack>     
            </CardHeader>
          </Card>
        </HStack>
           {project? (
            <>
              <HStack>
                <BudgetChart budget={project.budget} usedBudget={project.usedBudget} miscBudget={project.miscBudget} usedMiscBudget={project.usedMiscBudget}/>
                {project.invoice && project.invoice?.length > 0?(<InvoiceChart invoice={project.invoice}/>):(<></>)}
                {project.expense && project.expense?.length > 0?(<ExpenseChart expense={project.expense}/>):(<></>)}                
                <FinancialSummary project={project}/>
              </HStack>
              <Card variant="reportByUsers">
                <CardHeader>
                  <HStack>
                    <Box>
                      By Users
                    </Box>
                    <Box fontSize="12px">
                      (Click on user name to get more details)
                    </Box>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <HStack>
                    <RevenueByUsers projectResource={project.projectResource} budget={project.budget} usedBudget={project.usedBudget}/>
                  </HStack>

                </CardBody>
              </Card>

            </>              
            ):(<>
            </>)}                    
      </Stack>
    </>
  );
}
