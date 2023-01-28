export { WelcomeSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
    VStack
  } from '@chakra-ui/react'
import { util } from '../../../helpers/util';
import {userService} from '../../../services'

function WelcomeSection(props) {
    console.log("PROPS::"+JSON.stringify(props))
    return (
        <Card variant="dashboardWelcome">
            <CardHeader>
                <HStack>
                    <Box>
                        Welcome
                    </Box>
                    <Box fontWeight="600">
                        {userService.userValue?.firstName} {userService.userValue?.lastName} !
                    </Box>
                </HStack>
                
            </CardHeader>
            <CardBody>
                <Stack width="50%">
                    <HStack>
                        <Box width="50%" textAlign="right" fontWeight="600">
                            Role:
                        </Box>
                        <Box width="80%" textAlign="left">
                            Account Admin
                        </Box>
                    </HStack>
                </Stack>
                <Stack width="50%">
                    <HStack>
                        <Box  width="50%" textAlign="right" fontWeight="600">
                            Last Logged In:
                        </Box>
                        <Box width="80%" textAlign="left">
                            {util.getFormattedDateWithTime(userService.userValue?.lastSignIn)}
                        </Box>
                    </HStack>
                </Stack>
            </CardBody>
        </Card>

    );
}

export async function getServerSideProps(context) {
    return {
      props: {testDat: "3333"}, // will be passed to the page component as props
    }
  }