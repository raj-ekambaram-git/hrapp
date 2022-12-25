export { PageNotAuthorized };
import {
    Flex,
    Heading
  } from '@chakra-ui/react'

function PageNotAuthorized() {
    return (
        <>
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="teal.500"
            color="white"
            marginBottom="2rem"
            width="100%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              Not authorized to view this page. Please contact administrator.
            </Heading>
          </Flex>          
        </>
    );
}
