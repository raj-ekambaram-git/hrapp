import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import React, { useState, useEffect } from "react";
import {
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Flex,
  Heading,
  TableContainer,
  TableCaption,
  Badge,
  useDisclosure
} from '@chakra-ui/react'
import {PageMainHeader} from '../../components/common/pageMainHeader'
import { useDispatch } from "react-redux";
import { resetSelectedAccountId, setSelectedAccountId } from "../../store/modules/Account/actions";
import { AccountConstants } from "../../constants";
import SortTable from "../common/SortTable";
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
              status: <Badge color={`${account.status === "Active"? "paid_status": account.status === "Inactive"? "pending_status": "pending_status"}`}>{account.status}</Badge>,
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
              <TableContainer>
                  <SortTable columns={ACCOUNT_LIST_TABLE_COLUMNS} data={accounts} />
              </TableContainer>
          </div>
      ) : (
        <> 
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="teal.500"
            color="white"
            marginBottom="2rem"
            width="100%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              Not authorized to view this page. Please contact administrator.
            </Heading>
          </Flex>        
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