export { InvoiceCountCardSection };
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
  } from '@chakra-ui/react'
import InvoiceDueSection from './invoiceDueSection'


function InvoiceCountCardSection(props) {
    return (
        <>
        <Card variant="cashFlowInnerDetails">
            <CardHeader>
                {props.headerData}
            </CardHeader>
            <CardBody>
                    <Box color={props.fColor?props.fColor:""}>
                        {props.bodyData}
                    </Box>
                    <Box>
                        <InvoiceDueSection headerData={props.headerData} daysPast={props.daysPast} count={props.count}/>
                    </Box>

            </CardBody>
        </Card>

        </>
    );
}
