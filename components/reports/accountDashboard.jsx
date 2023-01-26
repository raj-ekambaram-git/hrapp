import React, { useEffect, useState } from "react";
import { accountService, userService } from "../../services";
import { Accordion, Box, Card, CardBody, CardHeader, HStack, Select, Stack } from "@chakra-ui/react";
import BudgetChart from "./vendor/charts/budgetChart";
import InvoiceChart from "./vendor/charts/invoiceChart";
import ExpenseChart from "./vendor/charts/expenseChart";
import FinancialSummary from "./vendor/financialSummary";
import { useDispatch, useSelector } from "react-redux";
import RevenueByProjects from "./vendor/charts/revenueByProjects";
import RevenueByUsers from "./vendor/charts/revenueByUsers";


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
                ?<Box fontWeight="semibold" boxSize={1} fontSize="12px">{userService.getAccountDetails().accountId}</Box>
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
                <BudgetChart projects={account.project}/>
                <InvoiceChart projects={account.project}/>
                <ExpenseChart projects={account.project}/>            
                <FinancialSummary projects={account.project}/>
              </HStack>
              <Accordion variant="vendorReport" defaultIndex={[0]} >
                <RevenueByProjects projects={account.project}/>
                <RevenueByUsers projects={account.project}/>              
              </Accordion>

          </>           
          ):(<>
          </>)}                    

      </Stack>
    </>
  );
}
