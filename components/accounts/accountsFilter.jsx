import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import React, { useState, useEffect } from "react";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  useDisclosure
} from '@chakra-ui/react'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import { useDispatch } from "react-redux";
import { resetSelectedAccountId, setSelectedAccountId } from "../../store/modules/Account/actions";
import { AccountConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";


export default function Home(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const ACCOUNT_LIST_TABLE_COLUMNS = React.useMemo(() => AccountConstants.ACCOUNT_LIST_TABLE_META)
  const [accounts, setAccounts] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  //INFO: used for making initial api calls
  useEffect(() => {
    async function performAccountsAPICall() {
      // Call only if the user is SUPER_ADMIN and accountId as zero
      if(userService.isSuperAdmin()) {
        setPageAuthorized(true);
        const accountsListResponse = await accountService.accountsList();
        if (accountsListResponse) {
          const accounts = accountsListResponse.map((account) => {
            return {
              id: account.id.toString(),
              name: account.name,
              createdDate: util.getFormattedDate(account.createdDate),
              lastUpdateDate: util.getFormattedDate(account.lastUpdateDate),
              email: account.email,
              ein: account.ein,
              status: account.status,
              detailAction: <Button size="xs" bgColor="header_actions" onClick={() => handleAccoundDetailSelection(account.id)}>Details</Button>
            };
          });
          setAccounts(accounts);
        }
      }else {
        //Show error message
      }

    }
    performAccountsAPICall();
  }, []);
  
  function handleAccoundDetailSelection(accountId) {
    console.log("handleAccoundDetailSelection::"+accountId)
    dispatch(resetSelectedAccountId())
    dispatch(setSelectedAccountId(accountId))
    router.push("/account/detail");
  }

  const navigatePage = () => router.push("/account/add");
  return (

    
    <div>
      {isPageAuthprized ? (
        <div>
              <PageMainHeader heading="Accounts"/>
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigatePage}>
                      Add New Account 
                    </Button>
                  </Box>
                </HStack>
              </Flex>
                  <CustomTable variant="sortTable" columns={ACCOUNT_LIST_TABLE_COLUMNS} rows={accounts} />
          </div>
      ) : (
        <> 
        </>
      ) }



      
      </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      data: {
        action: "accountsList"
      }
    },
    revalidate: 1,
  };
}