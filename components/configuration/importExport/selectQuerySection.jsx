export { SelectQuerySection };
    import { SmallCloseIcon } from '@chakra-ui/icons';
import {
    Badge,
    Flex,
    Text,
    HStack
  } from '@chakra-ui/react'
  
function SelectQuerySection(props) {



    return (
        <>
            <Flex>
                <Badge marginRight={2}>
                        <HStack>
                            <Text marginRight={1}>{props.selectQuery.key}</Text><SmallCloseIcon onClick={() => props.handleDeleteSelect(props.indexVal)}/>
                        </HStack>
                </Badge>                        
            </Flex>
        </>
    );
}
