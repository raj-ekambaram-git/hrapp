export { InvoiceReportSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import {accountService, userService} from '../../../services'
import { util } from '../../../helpers/util';
import {InnerCardSection} from './common/innerCardSection'
import {InvoiceCountCardSection} from './invoiceCountCardSection'

function InvoiceReportSection(props) {
    const [invoiceReportData, setInvoiceReportData] = useState();

    useEffect(() => {
        getInvoiceReportData()
      }, []);
    
      const getInvoiceReportData = async () => {
            if(userService.isAccountAdmin()) {
                const responseData = await accountService.getInvoiceReportData(userService.getAccountDetails().accountId);
                setInvoiceReportData(responseData)
            }                   
        }
   


       
    return (
        <>
            {invoiceReportData?
                <Card variant="invoiceReportDashboard">
                    <CardHeader>
                        Invoices Due
                    </CardHeader>
                    <CardBody variant="invoiceReportDashboard">
                        <Stack spacing={4}>
                            <HStack>
                                {invoiceReportData?.all?<InvoiceCountCardSection headerData="All" daysPast="all" count={invoiceReportData?.all[0]?.invoicecount} bodyData1={"Count: "+invoiceReportData?.all[0]?.invoicecount} bodyData={util.getWithCurrency(invoiceReportData?.all[0]?.total)} fColor="debit_amount"/>:<></>}
                                {invoiceReportData?.pastSixty?<InvoiceCountCardSection headerData="> 60 Days" daysPast="60" count={invoiceReportData?.pastSixty[0]?.invoicecount} bodyData1={"Count: "+invoiceReportData?.pastSixty[0]?.invoicecount} bodyData={util.getWithCurrency(invoiceReportData?.pastSixty[0]?.total)} fColor="credit_amount"/>:<></>}
                                {invoiceReportData?.pastFortyFive?<InvoiceCountCardSection headerData="> 45 Days" daysPast="45" count={invoiceReportData?.pastFortyFive[0]?.invoicecount} bodyData1={"Count: "+invoiceReportData?.pastFortyFive[0]?.invoicecount} bodyData={util.getWithCurrency(invoiceReportData?.pastFortyFive[0]?.total)} fColor="credit_amount"/>:<></>}
                                {invoiceReportData?.pastThirty?<InvoiceCountCardSection headerData="> 30 Days" daysPast="30" count={invoiceReportData?.pastThirty[0]?.invoicecount} bodyData1={"Count: "+invoiceReportData?.pastThirty[0]?.invoicecount} bodyData={util.getWithCurrency(invoiceReportData?.pastThirty[0]?.total)}/>:<></>}
                                {invoiceReportData?.pastFifteen?<InvoiceCountCardSection headerData="> 15 Days" daysPast="15" count={invoiceReportData?.pastFifteen[0]?.invoicecount} bodyData1={"Count: "+invoiceReportData?.pastFifteen[0]?.invoicecount} bodyData={util.getWithCurrency(invoiceReportData?.pastFifteen[0]?.total)}/>:<></>}
                            </HStack>
                        </Stack>
                    </CardBody>
                </Card>
            :<></>}
        </>
        


    );
}