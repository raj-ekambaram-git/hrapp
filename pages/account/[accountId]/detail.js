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
  StackDivider,
  Flex,
  HStack,
  Button,
  Accordion
} from '@chakra-ui/react';
import AccountDetailSection from "../../../components/account/detail/accountDetailSection";
import AccountEINSection from "../../../components/account/detail/accountEINSection";
import AccountContactDetailSection from "../../../components/account/detail/accountContactDetailSection";
import AccountContactAddressSection from "../../../components/account/detail/accountContactAddressSection";
import AccountStatusSection from "../../../components/account/detail/accountStatusSection";
import AccountActionsSection from "../../../components/account/detail/accountActionsSection";




const AccountDetail = (props) => {
  const router = useRouter();
  const accountId = props.data.accountId;
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [account, setAccount] = useState({});
  
  const navigateEditPage = () => router.push("/account/"+account.id);
  const navigateManageAccountUsersPage = () => router.push("/account/"+account.id+"/users");
  const navigateManageVendorsPage = () => router.push("/account/"+account.id+"/vendors");
  const navigateManageAccounts = () => router.push("/accounts");
  
  const actionItems = {
    navigateEditPage: navigateEditPage,
    navigateManageAccountUsersPage: navigateManageAccountUsersPage,
    navigateManageVendorsPage: navigateManageVendorsPage,
    navigateManageAccounts: navigateManageAccounts
  }
  
  
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
                <Accordion>
                  <AccountDetailSection data={{account}}/>
                  <AccountEINSection data={{account}}/>
                  <AccountContactDetailSection data={{account}}/>
                  <AccountContactAddressSection data={{account}}/>
                  <AccountStatusSection data={{account}}/>
                </Accordion>         
              </Stack>
            </CardBody>
          </Card>             

          <AccountActionsSection data={{actionItems}}/>
       
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
