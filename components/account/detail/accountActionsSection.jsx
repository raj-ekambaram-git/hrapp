import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button

} from '@chakra-ui/react';
import { useRouter } from "next/router";


const AccountActionsSection = (props) => {
  const router = useRouter();

  return (

    <div>
          <Flex marginTop="2rem">
            <HStack spacing={2}>
                <Box>
                <Button onClick={() => router.push("/account/edit")}>
                    Edit
                </Button>
                </Box>
                <Box>
                <Button onClick={() => router.push("/account/vendors")}>
                    Account Vendors
                </Button>
                </Box>   
                <Box>
                <Button onClick={() => router.push("/account/users")}>
                    Account Users
                </Button>
                </Box>   
                <Box>
                <Button onClick={() => router.push("/accounts")}>
                    Manage Accounts
                </Button>
                </Box>                                                      
            </HStack>
        </Flex>    

    </div>


  );
};

export default AccountActionsSection;
