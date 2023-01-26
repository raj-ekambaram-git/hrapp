import React, { useEffect, useState } from "react";
import { accountService, userService } from "../../services";
import { Accordion, Box, Card, CardBody, CardHeader, HStack, Select, Stack } from "@chakra-ui/react";
import BudgetChart from "./account/charts/budgetChart";
import InvoiceChart from "./account/charts/invoiceChart";
import ExpenseChart from "./account/charts/expenseChart";
import FinancialSummary from "./account/financialSummary";
import { useDispatch, useSelector } from "react-redux";
import RevenueByProjects from "./account/charts/revenueByProjects";
import RevenueByUsers from "./account/charts/revenueByUsers";
import RevenueByVendors from "./account/charts/revenueByVendors";


export default function AccountDashboard(props) {
  const dispatch = useDispatch();


  const [account, setAccount] = useState();

  useEffect(() => {
    if(userService.getAccountDetails().accountId) {
      getAccountReportData()
    }
  }, []);
  

  async function getAccountReportData() {
    const responseData = await accountService.getAccountReportData(userService.getAccountDetails().accountId);
    setAccount(responseData)
  }


return (
    <>    
    <Stack>
        <HStack>
          <Card variant="projectReportsHeader">
            <CardHeader>
              <HStack>
                {userService.getAccountDetails().accountId
                ?<Box fontWeight="semibold" boxSize={1} fontSize="12px"></Box>
                :(
                    <></>
                  )
                }      
              </HStack>     
            </CardHeader>
          </Card>
        </HStack>
        {account? (
            <>
               <HStack>
                <BudgetChart vendors={account.vendor}  canvasId="accountBudget"/>
                <InvoiceChart vendors={account.vendor} canvasId="accountInvoice"/>
                <ExpenseChart vendors={account.vendor} canvasId="accountExpense"/>            
                <FinancialSummary vendors={account.vendor}/>
              </HStack>
              <Accordion variant="vendorReport" defaultIndex={[0]} >
                <RevenueByVendors vendors={account.vendor} canvasId="accountRevenueByVendors"/>              
                <RevenueByProjects vendors={account.vendor} canvasId="accountRevenueByProjects"/>
                <RevenueByUsers vendors={account.vendor} canvasId="accountRevenueByUsers"/>                              
              </Accordion>

          </>           
          ):(<>
          </>)}                    

      </Stack>
    </>
  );
}
