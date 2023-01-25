import { Box, Card, CardBody, CardHeader, Tooltip, Heading, HStack, Stack } from "@chakra-ui/react";
import { ExpenseStatus, InvoiceStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { util } from "../../../helpers/util";


export default function FinancialSummary(props) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [invoiced, setInvoiced] = useState(0);
  const [invoicePaid, setInvoicePaid] = useState(0);
  const [invoiceNotPaid, setInvoiceNotPaid] = useState(0);
  const [notInvoiced, setNotInvoiced] = useState(0);
  const [submittedProjectCost, setSubmittedProjectCost] = useState(0);
  const [estimatedProjectCost, setEstimatedProjectCost] = useState(0);
  const [paidProjectCost, setPaidProjectCost] = useState(0);
  const [billableExpense, setBillableExpense] = useState(0);
  const [nonbillableExpense, setNonbillableExpense] = useState(0);
  const [paidExpense, setPaidExpense] = useState(0);
  const [unpaidExpense, setUnpaidExpense] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [estimatedNetRevenue, setEstimatedNetRevenue] = useState(0);
  

  useEffect(() => {
    if(props.project) {
      financialSummaryData();
    }    
  }, [props]);


  function financialSummaryData() {
    
    setTotalRevenue(util.getZeroPriceForNull(props.project.usedBudget)+util.getZeroPriceForNull(props.project.usedMiscBudget))

    //INCOME CALCULATION
    let invoicedTotal = 0;
    let invoicePaid = 0;
    props.project?.invoice?.map(inv => {
        invoicedTotal = parseFloat(invoicedTotal)+parseFloat(inv?.total)
        if((inv.status === InvoiceStatus.Paid || inv.status === InvoiceStatus.PartiallyPaid)) {
          invoicePaid = parseFloat(invoicePaid)+parseFloat(inv?.paidAmount)
        }
      })
    setInvoiced(invoicedTotal)  
    setInvoicePaid(invoicePaid)
    setInvoiceNotPaid(invoicedTotal-invoicePaid)

    //EXPENSE
    let expSubmiitedProjectCost = 0
    let expBillable = 0
    let expNonBillable = 0
    let expenseTotal = 0;
    let expensePaid = 0;
    let expenseNotInvoiced = 0;
    props.project?.expense?.map(exp => {
      if((exp.status != ExpenseStatus.Submitted && exp.status != ExpenseStatus.Draft)) {
        expenseTotal = parseFloat(expenseTotal)+parseFloat(exp?.total)
      }
      
      if(exp.status === ExpenseStatus.Paid || exp.status === ExpenseStatus.PartiallyPaid ||
        exp.status === ExpenseStatus.Approved || exp.status === ExpenseStatus.Invoiced ){
          const expenseAmounts = util.getTotalBillableExpense(exp.expenseEntries);
          expensePaid = parseFloat(expensePaid)+parseFloat(exp?.paidAmount)
          expSubmiitedProjectCost = expSubmiitedProjectCost+expenseAmounts?.totalProjectCost; 
          expBillable = expBillable+expenseAmounts?.billableExpense;
          expNonBillable = expNonBillable+expenseAmounts?.nonBillableExpense;
          if(exp.status === ExpenseStatus.PartiallyPaid || exp.status === ExpenseStatus.Approved) {
            expenseNotInvoiced = expenseNotInvoiced+expBillable;
          }
        }
      
    })

    let estProjectCost = 0;
    props.project?.projectResource?.map(resource => {
      estProjectCost = estProjectCost+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
    })

    setEstimatedProjectCost(estProjectCost)
    setBillableExpense(expBillable)
    setNonbillableExpense(expNonBillable)
    setSubmittedProjectCost(expSubmiitedProjectCost)
    setPaidExpense(expensePaid)
    setUnpaidExpense(parseFloat(expenseTotal)-parseFloat(expensePaid))
    setNetRevenue((util.getZeroPriceForNull(props.project.usedBudget)+util.getZeroPriceForNull(props.project.usedMiscBudget)-(util.getZeroPriceForNull(expSubmiitedProjectCost)+util.getZeroPriceForNull(expBillable)+util.getZeroPriceForNull(expNonBillable))))    
    setEstimatedNetRevenue((util.getZeroPriceForNull(props.project.usedBudget)+util.getZeroPriceForNull(props.project.usedMiscBudget)-(util.getZeroPriceForNull(estProjectCost)+util.getZeroPriceForNull(expBillable)+util.getZeroPriceForNull(expNonBillable))))    
  }


  
  return (
    <>    
      <Card variant="projectFinancialSummary">
        <CardHeader>
          <Heading size='xs' textAlign="center">Summary as of {util.getFormattedDate(new Date())}</Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            <HStack>
              <Stack width="50%">
                <HStack>
                  <Box textAlign="left" fontWeight="semibold" fontStyle="italic">
                    Income
                  </Box>
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Total Revenue :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(totalRevenue)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Invoiced :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" >
                    {util.getWithCurrency(invoiced)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Paid Invoice :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color="debit_amount">
                    {util.getWithCurrency(invoicePaid)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Invoice Not Paid :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={util.getZeroPriceForNull(invoiceNotPaid) > 0?'credit_amount':""}>
                    {util.getWithCurrency(invoiceNotPaid)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="50%" textAlign="right">
                    Not Invoiced :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={util.getZeroPriceForNull(notInvoiced) > 0 ? 'credit_amount':""}>
                    {util.getWithCurrency((util.getZeroPriceForNull(totalRevenue)-util.getZeroPriceForNull(invoiced)))}
                  </Box>              
                </HStack>                                                
              </Stack>
              <Stack width="70%">
                <HStack>
                  <Box textAlign="left" fontWeight="semibold" fontStyle="italic">
                    Expense
                  </Box>
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    <Tooltip label="Includes all the resource cost for the project.">
                      Estimated Project Cost :
                    </Tooltip>
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(estimatedProjectCost)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                  <Tooltip label="Submitted/Approved project cost (resource cost).">
                    Submiitted Project Cost :
                  </Tooltip>
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(submittedProjectCost)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    <Tooltip label="Project coast paid as of today.">
                      Paid Project Cost :
                    </Tooltip>
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(submittedProjectCost)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    Billable Expense :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(billableExpense)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    Non-Billable Expense :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(nonbillableExpense)}
                  </Box>              
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    Paid Expense :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(paidExpense)}
                  </Box>   
                </HStack>  
                  <HStack>
                  <Box width="60%" textAlign="right">
                    UnPaid Expense :
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    {util.getWithCurrency(unpaidExpense)}
                  </Box>                             
                </HStack>
                <HStack>
                  <Box width="60%" textAlign="right">
                    
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold">
                    
                  </Box>              
                </HStack>                                            
              </Stack>          
            </HStack>
            <HStack>
                  <Box width="60%" textAlign="right" fontWeight="semibold" fontStyle="italic">
                    <Tooltip label="Estimated net revenue after removing all the known costs as of now.">
                      Estimated Net Revenue :
                    </Tooltip>
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={util.getZeroPriceForNull(estimatedNetRevenue) > 0 ? 'debit_amount':"credit_amount"}>
                    {util.getWithCurrency(estimatedNetRevenue)}
                  </Box>  
            </HStack>
            <HStack>
                  <Box width="60%" textAlign="right" fontWeight="semibold" fontStyle="italic">
                    <Tooltip label="Net revenue as of today excluding all the project expenses (aproved resource cost, billabld and non-billable expense) approved">
                      Actual Net Revenue :
                    </Tooltip>
                  </Box>
                  <Box width="50%" textAlign="left" fontWeight="semibold" color={util.getZeroPriceForNull(netRevenue) > 0 ? 'debit_amount':"credit_amount"}>
                    {util.getWithCurrency(netRevenue)}
                  </Box>  
            </HStack>            
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
