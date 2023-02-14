import React, { useCallback, useContext, useEffect, useState } from "react";
import { accountService, paymentService, userService } from "../../../services";
import {
  Card,
  CardHeader,
  CardBody,
  useToast,
  Button,
  Stack,
  HStack,
  Box,
  Heading,
  Badge,
  Switch,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from "react-redux";
import {setAccountPaymentToken, setPaymentInitiation, setPaymentProducts} from '../../../store/modules/Account/actions'
import ConfigurePaymentProcessor from '../payment/configurePaymentProcessor'
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { PaymentMethodStatus } from "@prisma/client";
import { Spinner } from "../../common/spinner";
import { ConfigConstants } from "../../../constants";



const ManagePaymentAccounts = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [token, setToken] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [accountFeature, setAccountFeature] = useState(null);
  const [linkedAccountData, setLinkedAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configurePaymentProcessor, setConfigurePaymentProcessor] = useState(false);
  

  const linkToken = useSelector(state => state.account?.payment?.linkPaymentToken);
  const onSuccess = useCallback(async (publicToken, metadata) => {
    console.log("metadata::::"+JSON.stringify(metadata))
    setLoading(true);
    const exchangeResponse = await paymentService.exchangeForAccessToken(publicToken, userService.userValue.id, userService.getAccountDetails().accountId, metadata)
    if(exchangeResponse.error) {
      toast({
        title: 'Add Payment.',
        description: 'Error adding an account, please try again later or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })     
      setLoading(false)
      return;
      
    } else {
      toast({
        title: 'Add Payment.',
        description: 'Successfully added the account details.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })    
      setLinkedAccountData(exchangeResponse)
      await getBalance();
    }
    
  }, []);

  // Creates a Link token
  const createLinkToken = React.useCallback(async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {     
      if(linkToken) {
        setToken(linkToken);
      }
      
    } else {
      const createLinkResponse = await paymentService.createLinkToken(userService.userValue.id, userService.getAccountDetails().accountId);
      setToken(createLinkResponse.link_token);      
      dispatch(setAccountPaymentToken(createLinkResponse.link_token))
    }
  }, [setToken]);

  // Fetch balance data
  const getBalance = React.useCallback(async () => {
    setLoading(true);
    const balanceResponse = await paymentService.accountBalance(userService.userValue.id, userService.getAccountDetails().accountId)
    console.log("balanceResponse:::"+JSON.stringify(balanceResponse))
    setBalanceData(balanceResponse);
    setLoading(false);
  }, [setBalanceData, setLoading]);

  let isOauth = false;

  const config = {
    token,
    onSuccess,
  };

  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {

    if(userService.isSuperAdmin() || (userService.isAccountAdmin() && userService.isPaymentAdmin())) {
      setPageAuthorized(true);
      getExistingAccounts();

      if (isOauth && ready) {
        open();
      }  
    }

  }, []);
  
  const getExistingAccounts = async() => {
    //First get the account config data
    const paymentConfigData = await accountService.isPaymentConfigured(userService.userValue.id, userService.getAccountDetails().accountId);
    setConfigurePaymentProcessor(userService.accountFeatureEnabled(ConfigConstants.FEATURES.PAYMENT_PROCESSOR))

    if((userService.accountFeatureEnabled(ConfigConstants.FEATURES.PAYMENT_PROCESSOR) && paymentConfigData && paymentConfigData.configured) || !userService.accountFeatureEnabled(ConfigConstants.FEATURES.PAYMENT_PROCESSOR)) {
      console.log("paymentConfigData:::"+JSON.stringify(paymentConfigData))
      setAccountFeature(paymentConfigData)
      //First see if there are already linked accounts
      const linkedAccountData = await paymentService.getMethodsByAccount(userService.userValue.id, userService.getAccountDetails().accountId);
      if(linkedAccountData) {
        setLinkedAccountData(linkedAccountData)
      } else {
        if (token == null) {
          createLinkToken();
        }

      }
      setLoading(false);
    } else {
      setAccountFeature(paymentConfigData)      
      setLoading(false);
    }

  }

  const handleStatusUpdate = async (status) => {
    const linkedAccountData = await paymentService.updateExistingAccount(userService.userValue.id, userService.getAccountDetails().accountId, status);
    if(linkedAccountData) {
      setLinkedAccountData(linkedAccountData)
    } else {
      setLinkedAccountData(null)
      if (token == null) {
        createLinkToken();
      }

    }
    setLoading(false);
  }

  const handleTransfer = async () => {
    const transferLinkResponse = await paymentService.initiateTransfer(userService.userValue.id, userService.getAccountDetails().accountId);
    setToken(transferLinkResponse.link_token);      
    dispatch(setAccountPaymentToken(transferLinkResponse.link_token))
  }


  return (


    <div>
      {isPageAuthprized?<>
        {loading?<><Spinner /></>:<></>}        
        <Card variant="userSettingCard">
            <CardHeader>
                Manage Payment Accounts
            </CardHeader>
            <CardBody>      
            {configurePaymentProcessor?<>
              <ConfigurePaymentProcessor accountFeature={accountFeature}/>
              </>:<></>}
                <Button marginBottom={3} onClick={() => open()
                    } disabled={!ready}>
                    <strong>Link account</strong>
                </Button>
                  {linkedAccountData?<>
                    <Card>
                      <CardBody>
                        <Stack spacing={5}>
                          <HStack>

                              <Heading width="11%" size="xs">
                                  Bank Name
                              </Heading>
                              <Box fontSize={14} textAlign="left" fontWeight="600">
                                  {linkedAccountData.institutionName}
                              </Box>
                          </HStack>
                          <HStack spacing={5}>
                            <Heading width="10%" size="xs">
                                Status
                            </Heading>
                            <Box textAlign="left">
                                <Badge color={linkedAccountData.accountPaymentMethodInfo?.status === PaymentMethodStatus.Active?"paid_status":"pending_status"}>
                                  {linkedAccountData.accountPaymentMethodInfo?.status}
                                </Badge>
                            </Box>                              
                            <Box>
                              {linkedAccountData.accountPaymentMethodInfo?.status === PaymentMethodStatus.Active?<>
                                <Switch colorScheme='teal' size='sm' id='Active' isChecked onChange={() => handleStatusUpdate(PaymentMethodStatus.Inactive)} >Mark Inactive</Switch>
                              </>:<></>}
                            </Box>
                          </HStack>
                        </Stack>
                      </CardBody>
                    </Card>
                  </>:<></>}
                {!loading &&
                  balanceData != null &&
                  Object.entries(balanceData).map((entry, i) => (
                    <pre key={i}>
                      <code>{JSON.stringify(entry[1], null, 2)}</code>
                    </pre>
                  )
                )}                        
            </CardBody>
          </Card>
      </>:<></>}
      </div>

  );
};

export default ManagePaymentAccounts;
