export { FilterBySection };
    import { SmallCloseIcon } from '@chakra-ui/icons';
import {
    Badge,
    Flex,
    Text,
    HStack
  } from '@chakra-ui/react'
  
function FilterBySection(props) {



    return (
        <>
            <Flex>
                <Badge marginRight={2}>
                        <HStack>
                            <Text marginRight={1}>{props.filterBy.key}</Text><SmallCloseIcon onClick={() => props.handleDeleteFilterBy(props.indexVal)}/>
                        </HStack>
                </Badge>                        
            </Flex>
        </>
    );
}
