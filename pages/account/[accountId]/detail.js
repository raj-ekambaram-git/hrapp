import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../../services";
import {
  Card,
  CardHeader,
  Box,
  Heading,
  CardBody,
  Stack,
  Text,
  StackDivider,
  Badge,
  Flex,
  HStack,
  Button
} from '@chakra-ui/react'

const AccountDetail = (props) => {
  const router = useRouter();
  const accountId = props.data.accountId;
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [account, setAccount] = useState({});
  
  const navigateEditPage = () => router.push("/account/"+account.id);
  const navigateManageAccountUsersPage = () => router.push("/account/"+account.id+"/users");
  const navigateManageVendorsPage = () => router.push("/account/"+account.id+"/vendors");
  const navigateManageAccounts = () => router.push("/accounts");
  

  
  
  // set default input data
  useEffect(() => {
      async function getAccountDetailsAPICall() {
        // Call only if the user is SUPER_ADMIN and accountId as zero
        if(userService.isSuperAdmin()) {
          setPageAuthorized(true);
          const accountResponse = await accountService.accountDetail(accountId);
            const accountData =  {
                id: accountResponse.id.toString(),
                name: accountResponse.name,
                description: accountResponse.description,
                ein: accountResponse.ein,
                email: accountResponse.email,
                status: accountResponse.status,
                phone: accountResponse.phone,
                addressId: accountResponse.address[0].id,
                addressName: accountResponse.address[0].addressName,
                address1: accountResponse.address[0].address1,
                address2: accountResponse.address[0].address2,
                address3: accountResponse.address[0].address3,
                city: accountResponse.address[0].city,
                state: accountResponse.address[0].state,
                zipCode: accountResponse.address[0].zipCode,
                country: accountResponse.address[0].country
            };
  
            setAccount(accountData)
        }
  
      }
      getAccountDetailsAPICall();
    
  }, []);

  return (
    <div>
      {isPageAuthprized ? (
        <>
          <Card>
            <CardHeader bgColor="heading">
              <Heading size='md'>Account Details for {account.name}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Details
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {account.description}
                  </Text>                
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Account EIN
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {account.ein}
                  </Text>                
                </Box>                
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Account Contact Details
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {account.email}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {account.phone}
                  </Text>                  
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Account Contact Address
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {account.addressName}
                  </Text>                  
                  <Text pt='2' fontSize='sm'>
                    {account.address1}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {account.address2}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {account.address3}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {account.city}, {account.state} {account.zipCode} 
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    {account.country}
                  </Text>                                                                                                            
                </Box>
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
              </Stack>
            </CardBody>
          </Card>             

          <Flex marginTop="2rem">
                <HStack spacing={2}>
                  <Box>
                    <Button className="btn" onClick={navigateEditPage}>
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button className="btn" onClick={navigateManageVendorsPage}>
                      Account Vendors
                    </Button>
                  </Box>   
                  <Box>
                    <Button className="btn" onClick={navigateManageAccountUsersPage}>
                      Account Users
                    </Button>
                  </Box>   
                  <Box>
                    <Button className="btn" onClick={navigateManageAccounts}>
                      Manage Accounts
                    </Button>
                  </Box>                                                      
                </HStack>
              </Flex>          
        </>
      ) : (
        <div className="account__header">
          <div className="iaccount_header-logo">
            <h3>Not Authorized to view this page. Please contact administrator.</h3>
          </div>
        </div>

      )}
    </div>
  );
};

export default AccountDetail;



export async function getStaticPaths() {

  return {
    paths: [{ params: { accountId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  const { accountId } = context.params;
  return {
    props: {
      data: {
        accountId: accountId
      },
    },
    revalidate: 1,
  };
}
