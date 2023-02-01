export { FilterBySection };
    import { SmallCloseIcon } from '@chakra-ui/icons';
import {
    Badge,
    Flex,
    Text,
    HStack,
    Box,
    Input
  } from '@chakra-ui/react'
  
function FilterBySection(props) {



    return (
        <>
            <Box border="1px" padding={2}>
                <HStack>
                    <Box width="60%" textAlign="right">
                        <Text fontSize="19px" fontWeight="600" marginRight={1}>{props.filterBy.key}</Text>
                    </Box>
                    <Box width="30%">
                        <Input type="text" width="50%" value={props.filterBy.operator} onChange={(ev) => props.handleFIlterByInput(ev.target.value, props.indexVal,"operator")}/>
                    </Box>
                    <Box width="30%" alignItems="left">
                            <Input type="text" width="100%" value={props.filterBy.value} onChange={(ev) => props.handleFIlterByInput(ev.target.value, props.indexVal,"value")}/>
                    </Box>
                    <Box width="30%">
                        <SmallCloseIcon onClick={() => props.handleDeleteFilterBy(props.indexVal)}/>
                    </Box>                
                </HStack>
            </Box>
        </>
    );
}
