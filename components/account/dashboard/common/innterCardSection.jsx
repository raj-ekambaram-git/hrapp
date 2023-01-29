export { InnerCardSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
  } from '@chakra-ui/react'


function InnerCardSection(props) {
    return (
        <>
        <Card variant="cashFlowInnerDetails">
            <CardHeader>
                {props.headerData}
            </CardHeader>
            <CardBody>
                    {props.bodyData}
            </CardBody>
        </Card>

        </>
    );
}
