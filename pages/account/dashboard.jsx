import { useRouter } from "next/router";
import { Tooltip, Text, Icon, Container } from '@chakra-ui/react';
import {WelcomeSection} from '../../components/account/dashboard/welcomeSection'

export default function Home(props) {
  const router = useRouter();
  const { data } = props;

  return (
    <WelcomeSection/>
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


