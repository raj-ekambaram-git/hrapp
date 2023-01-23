import React, { useEffect, useState } from "react";
import { accountService, projectService, userService } from "../../services";
import { Box, Card, CardBody, CardHeader, HStack, Select, Stack } from "@chakra-ui/react";
import BudgetChart from "./project/charts/budgetChart";
import InvoiceChart from "./project/charts/invoiceChart";
import ExpenseChart from "./project/charts/expenseChart";
import FinancialSummary from "./project/financialSummary";
import { useDispatch, useSelector } from "react-redux";


export default function VendorDashboard(props) {
  const dispatch = useDispatch();

  const [vendor, setVendor] = useState();
  const [displayProjectSelection, setDisplayProjectSelection] = useState(false)
  const [vendorList, setVendorList] = useState([])
  const vendorId = useSelector(state => state.reports.vendor.selectedReportsVendorId);
  // const projectId = "209"

  useEffect(() => {
    if(vendorId) {
      getVendorReportData(vendorId);
    }else {
      getVendorList(userService.userValue.id);
    }
    
  }, []);
  
  async function getVendorList(userId ) {
    const vendorListResponse = await accountService.getVendorList(userService.getAccountDetails().accountId);
    setVendorList(vendorListResponse);
}

  async function getVendorReportData(vendorIdInput) {
    console.log("vendorIdInput::"+vendorIdInput)
    // const responseData = await projectService.getProjectBudgetDetails(projectIdInput, userService.getAccountDetails().accountId);
    // console.log("responseData::"+JSON.stringify(responseData))
    // setProject(responseData)
  }


return (
    <>    
    <Stack>
        <HStack>
          <Card variant="projectReportsHeader">
            <CardHeader>
              <HStack>
                {vendorId
                ?<Box fontWeight="semibold">{vendorId}</Box>
                :(
                    <></>
                  )
                }    
                      <Select width="30%" bgColor="white"  onChange={(ev) => getVendorReportData(ev.target.value)} value={vendorId}>
                            <option value="">Select an Vendor</option>
                            {vendorList?.map((vendor) => (
                              <option value={vendor.id} data-email={vendor.email}>{vendor.name}</option>
                            ))}
                      </Select> 
              </HStack>     
            </CardHeader>
          </Card>
        </HStack>
           {vendor? (
              <HStack>
                {/* <BudgetChart budget={project.budget} usedBudget={project.usedBudget} miscBudget={project.miscBudget} usedMiscBudget={project.usedMiscBudget}/>
                {project.invoice && project.invoice?.length > 0?(<InvoiceChart invoice={project.invoice}/>):(<></>)}
                {project.expense && project.expense?.length > 0?(<ExpenseChart expense={project.expense}/>):(<></>)}                
                <FinancialSummary project={project}/> */}
              </HStack>
            ):(<>
            </>)}                    
      </Stack>
    </>
  );
}
