import { Box, Card, CardBody, CardHeader, Heading, HStack, Stack } from "@chakra-ui/react";
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
                $ {totalRevenue}
              </Box>              
            </HStack>
            <HStack>
              <Box width="50%" textAlign="right">
                Invoiced :
              </Box>
              <Box width="50%" textAlign="left" fontWeight="semibold">
                $ {invoiced}
              </Box>              
            </HStack>
            <HStack>
              <Box width="50%" textAlign="right">
                Paid Invoice :
              </Box>
              <Box width="50%" textAlign="left" fontWeight="semibold">
                $ {invoicePaid}
              </Box>              
            </HStack>
            <HStack>
              <Box width="50%" textAlign="right">
                Invoice Not Paid :
              </Box>
              <Box width="50%" textAlign="left" fontWeight="semibold">
                $ {invoiceNotPaid}
              </Box>              
            </HStack>
            <HStack>
              <Box width="50%" textAlign="right">
                Not Invoiced :
              </Box>
              <Box width="50%" textAlign="left" fontWeight="semibold">
                $ {notInvoiced}
              </Box>              
            </HStack>                                                
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
