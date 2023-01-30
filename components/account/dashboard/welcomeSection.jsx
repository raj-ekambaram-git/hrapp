export { WelcomeSection };
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

function WelcomeSection(props) {
    return (
        <Card variant="dashboardWelcome">
            <CardHeader>
                <HStack>
                    <Box>
                        Welcome Back
                    </Box>
                    <Box fontWeight="500">
                        {userService.userValue?.firstName} {userService.userValue?.lastName} !
                    </Box>
                </HStack>
                
            </CardHeader>
            <CardBody>
                <Stack width="50%" marginBottom={4}>
                    <HStack>
                        <Box  width="50%" textAlign="right" fontWeight="600">
                            Username:
                        </Box>
                        <Box width="60%" textAlign="left">
                            {userService.userValue?.username}
                        </Box>
                    </HStack>                        
                    <HStack>
                        <Box width="50%" textAlign="right" fontWeight="600">
                            Role:
                        </Box>
                        <Box width="60%" textAlign="left">
                            {util.getUserRole()?.map((userRole) => (
                                <Box>
                                    {userRole}
                                </Box>
                            ))}         
                        </Box>
                    </HStack>
                    <HStack>
                        <Box  width="50%" textAlign="right" fontWeight="600">
                            Last logged in:
                        </Box>
                        <Box width="60%" textAlign="left">
                            {util.getFormattedDateWithTime(userService.userValue?.lastSignIn)}
                        </Box>
                    </HStack>                    
                </Stack>
            </CardBody>
        </Card>

    );
}