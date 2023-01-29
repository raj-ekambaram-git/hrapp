export { HelpSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
  } from '@chakra-ui/react'
import { util } from '../../../helpers/util';
import {userService} from '../../../services'

function HelpSection(props) {
    return (
        <Card variant="helpDashboard">
            <CardHeader>
                Help Links
            </CardHeader>
            <CardBody>
                <Stack width="40%" marginBottom={4}>
                    <HStack>
                        <Box  width="50%" textAlign="right" fontWeight="600">
                            
                        </Box>
                        <Box width="60%" textAlign="left">
                            Links TODO
                        </Box>
                    </HStack>                                          
                </Stack>
            </CardBody>
        </Card>

    );
}