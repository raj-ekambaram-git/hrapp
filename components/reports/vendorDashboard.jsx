import React, { useEffect, useState } from "react";
import { accountService, userService, vendorService } from "../../services";
import { Box, Card, CardHeader, HStack, Select, Stack , CardBody, Accordion, Badge} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import BudgetChart from "./vendor/charts/budgetChart";
import InvoiceChart from "./vendor/charts/invoiceChart";
import ExpenseChart from "./vendor/charts/expenseChart";
import {setSelectedReportsVendorId} from '../../store/modules/Reports/actions'
import FinancialSummary from "./vendor/financialSummary";
import RevenueByUsers from "./vendor/charts/revenueByUsers";
import RevenueByProjects from "./vendor/charts/revenueByProjects";
import { VendorType } from "@prisma/client";


export default function VendorDashboard(props) {
  const dispatch = useDispatch();

  const [vendor, setVendor] = useState();
  const [displayProjectSelection, setDisplayProjectSelection] = useState(false)
  const [vendorList, setVendorList] = useState([])
  const vendorId = useSelector(state => state.reports.vendor.selectedReportsVendorId);
  // const projectId = "209"

  useEffect(() => {
    getVendorList(userService.userValue.id);
    if(vendorId) {
      getVendorReportData(vendorId);
    }    
  }, [vendorId]);
  
  async function getVendorList(userId ) {
    const vendorListResponse = await accountService.getVendorList(userService.getAccountDetails().accountId);
    setVendorList(vendorListResponse);
}

  async function getVendorReportData(vendorIdInput) {
    dispatch(setSelectedReportsVendorId(vendorIdInput))
    const responseData = await vendorService.getVendorReportData(vendorIdInput, userService.getAccountDetails().accountId);
    setVendor(responseData)
  }


return (
    <>    
    <Stack>
        <HStack>
          <Card variant="projectReportsHeader">
            <CardHeader>
              <HStack>
                {vendorId
                ?<Box fontWeight="semibold"></Box>
                :(
                    <></>
                  )
                }    
                <Select width="30%" bgColor="white" size="sm" onChange={(ev) => getVendorReportData(ev.target.value)} value={vendorId}>
                      <option value="">Select Client</option>
                      {vendorList?.map((vendor) => (
                        vendor.type != VendorType.Supplier?<>
                          <option value={vendor.id} data-email={vendor.email}>{vendor.name}</option>
                        </>:<></>      
                      ))}
                </Select> 
                {vendor?(
                  <>
                    <Badge color={`${(vendor.status === "Active" ||vendor.status === "Approved" )? "paid_status":vendor.status === "Inactive"? "pending_status": "pending_status"}`}>{vendor.status}</Badge>
                  </>
                 ):(<></>)}                   
              </HStack>     
            </CardHeader>
          </Card>
        </HStack>
           {vendor? (
            <>
              <HStack>
                <BudgetChart projects={vendor.project} canvasId="vendorBudget"/>
                <InvoiceChart projects={vendor.project} canvasId="vendorInvoice"/>
                <ExpenseChart projects={vendor.project} canvasId="vendorExpense"/>            
                <FinancialSummary projects={vendor.project}/>
              </HStack>
              <Accordion variant="vendorReport" defaultIndex={[0]} >
                <RevenueByProjects projects={vendor.project} canvasId="vendorRevenueByProjects"/>
                <RevenueByUsers projects={vendor.project} canvasId="vendorRevenueByUsers"/>              
              </Accordion>

          </>           
          ):(<>
          </>)}                    
      </Stack>
    </>
  );
}
