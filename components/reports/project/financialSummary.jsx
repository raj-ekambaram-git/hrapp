import { Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
import { InvoiceStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { util } from "../../../helpers/util";


export default function FinancialSummary(props) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [invoiced, setInvoiced] = useState(0);
  const [invoicePaid, setInvoicePaid] = useState(0);
  const [invoiceNotPaid, setInvoiceNotPaid] = useState(0);
  const [notInvoiced, setNotInvoiced] = useState(0);

  useEffect(() => {
    if(props.project) {
      financialSummaryData();
    }    
  }, []);
  


  function financialSummaryData() {
    setTotalRevenue(props.project.usedBudget)

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

    let notInvoicedTSE = 0;
    props.project?.timesheetEntries?.map(timesheetEntry => {
      const totalHours = util.getTotalHours(timesheetEntry.entries)
      console.log("totalHours::"+JSON.stringify(timesheetEntry))
      notInvoicedTSE = parseFloat(notInvoicedTSE)+(parseFloat(timesheetEntry?.unitPrice)*parseInt(totalHours))
      console.log("NOt Invoicess::"+notInvoicedTSE)
    })
    console.log("notInvoiced::"+notInvoicedTSE)
    setNotInvoiced(notInvoicedTSE)
  
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
                {util.getWithCurrency(notInvoiced)}
              </Box>              
            </HStack>                                                
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
