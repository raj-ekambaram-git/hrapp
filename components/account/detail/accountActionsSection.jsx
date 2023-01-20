import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button

} from '@chakra-ui/react';
import { useRouter } from "next/router";
import ManageDocuments from "../../document/manageDocuments";


const AccountActionsSection = (props) => {
  const router = useRouter();

  return (

    <div>
          <Flex>
            <HStack spacing={2}>
                <Box>
                <Button size="xs" bgColor="header_actions" onClick={() => router.push("/account/edit")}>
                    Edit
                </Button>
                </Box>
                <Box>
                <Button size="xs" bgColor="header_actions" onClick={() => router.push("/account/vendors")}>
                    Account Vendors
                </Button>
                </Box>   
                <Box>
                <Button size="xs" bgColor="header_actions" onClick={() => router.push("/account/users")}>
                    Account Users
                </Button>
                </Box>   
                <Box>
                <Button size="xs" bgColor="header_actions" onClick={() => router.push("/accounts")}>
                    Manage Accounts
                </Button>
                </Box>      
                <ManageDocuments/>                                                
            </HStack>
        </Flex>    

    </div>


  );
};

export default AccountActionsSection;
