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
                    <Box color={props.fColor?props.fColor:""}>
                        {props.bodyData}
                    </Box>
                    <Box>
                        {props.bodyData1}
                    </Box>

            </CardBody>
        </Card>

        </>
    );
}
