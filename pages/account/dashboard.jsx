import { useRouter } from "next/router";
import {WelcomeSection} from '../../components/account/dashboard/welcomeSection'
import {ApprovalSection} from '../../components/account/dashboard/approvalSection'
import {HelpSection} from '../../components/account/dashboard/helpSection'
import { HStack, Stack } from "@chakra-ui/react";

export default function Home(props) {
  const router = useRouter();
  const { data } = props;

  return (
    <>
      <Stack marginTop={10}>
        <HStack spacing={50}>
          <WelcomeSection/>
          <ApprovalSection/>
          <HelpSection/>
        </HStack>
      </Stack>
    </>
    // <div className="main__container">
    //     <h1> Welcome!</h1>

    //           <Text display="inline-flex" alignItems="baseline">
    //             Account Dashboard
    //             <Tooltip
    //             label="Tooltip with green color scheme and new small size."
    //             placement="right"
    //             colorScheme="brand"
    //             size="sm"
    //             hasArrow
    //             >
    //             <Icon as={QuestionIcon} mx={2} color="green.400" />
    //             </Tooltip>
    //           </Text>
    // </div>
  );
}


