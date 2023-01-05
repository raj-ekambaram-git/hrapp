export { DrawerMainHeader };
import {
    Flex,
    Heading
  } from '@chakra-ui/react'

function DrawerMainHeader(props) {
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
            width="90%"
            >
             <Heading size='md'>{heading} {param1}</Heading>
            </Flex>        
        </>
    );
}






  