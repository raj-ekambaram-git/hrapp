import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button

} from '@chakra-ui/react';


const AccountActionsSection = (props) => {
    const actionItems = props.data.actionItems;

  return (

    <div>
          <Flex marginTop="2rem">
            <HStack spacing={2}>
                <Box>
                <Button className="btn" onClick={actionItems.navigateEditPage}>
                    Edit
                </Button>
                </Box>
                <Box>
                <Button className="btn" onClick={actionItems.navigateManageVendorsPage}>
                    Account Vendors
                </Button>
                </Box>   
                <Box>
                <Button className="btn" onClick={actionItems.navigateManageAccountUsersPage}>
                    Account Users
                </Button>
                </Box>   
                <Box>
                <Button className="btn" onClick={actionItems.navigateManageAccounts}>
                    Manage Accounts
                </Button>
                </Box>                                                      
            </HStack>
        </Flex>    

    </div>


  );
};

export default AccountActionsSection;
