export { PageMainHeader };
import {
    Flex,
    Heading
  } from '@chakra-ui/react'

function PageMainHeader(props) {
    const heading = props.heading;
    const param1 = props.param1;
    return (
        <>
            <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="page.heading"
            bg="heading"
            color="white"
            marginBottom="page.heading_marginBottom"
            width="page.heading_width"
            >
             <Heading size='md'>{heading} {param1}</Heading>
            </Flex>        
        </>
    );
}






  