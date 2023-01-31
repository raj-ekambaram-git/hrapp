export { SelectQuerySection };
import {
    Flex,
    Heading
  } from '@chakra-ui/react'

function SelectQuerySection(props) {
    return (
        <>
            {JSON.stringify(props.selectQuery)}
        </>
    );
}
