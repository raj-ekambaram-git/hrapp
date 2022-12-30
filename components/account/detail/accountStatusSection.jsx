import React from "react";
import {
  Box,
  Heading,
  Badge
} from '@chakra-ui/react';


const AccountStatusSection = (props) => {
    const account = props.data.account;
    console.log("account::"+JSON.stringify(account))

  return (

    <div>
        <Box>
            <Heading size='xs' textTransform='uppercase'>
            Account Status
            </Heading>
            <Badge color={`${
                account.status === "Active"
                    ? "paid_status"
                    : account.status === "Inactive"
                    ? "pending_status"
                    : "pending_status"
                }`}>{account.status}</Badge>

        </Box>   

    </div>


  );
};

export default AccountStatusSection;
