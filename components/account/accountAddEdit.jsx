import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, ACCOUNT_VALIDATION_SCHEMA} from "../../constants/accountConstants";
import {US_STATES} from "../../constants/commonConstants";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  useToast
} from '@chakra-ui/react'
import { PageMainHeader } from "../common/pageMainHeader";
import { PageNotAuthorized } from "../common/pageNotAuthorized";

const AccountAddEdit = (props) => {
  const accountId = props.data.accountId;
  const router = useRouter();
  const toast = useToast();
  const accountName = useRef("");
  const accountDescription = useRef("");
  const addressName = useRef("");
  const address1 = useRef("");
  const address2 = useRef("");
  const address3 = useRef("");
  const city = useRef("");
  const country = useRef("");
  const state = useRef("");
  const zipCode = useRef("");
  const accountEIN = useRef("");
  const accountEmail = useRef("");
  const [accountPhone, setAccountPhone] = useState("");
  const [account, setAccount] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);

  //Check if the mode is ADD or EDIT

  //Account Validation START
  const formOptions = { resolver: yupResolver(ACCOUNT_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm();
  const { errors } = formState;


  const handlePhoneInput = (e) => {
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e);
    // we'll set the input value using our setInputValue
    setValue("accountPhone", formattedPhoneNumber);
    // setAccountPhone(formattedPhoneNumber);
  };
  //Account Validation END



  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {

      setAddMode(false);
    }

    if(userService.isSuperAdmin()) {
      setPageAuthorized(true);
    }
    async function getAccountDetailsAPICall() {
      // Call only if the user is SUPER_ADMIN and accountId as zero
      if(userService.isSuperAdmin() && (props && props.data && props.data.mode != MODE_ADD)) {
        setPageAuthorized(true);
        const accountResponse = await accountService.accountDetail(props.data.accountId);
          const accountData =  {
              id: accountResponse.id.toString(),
              accountName: accountResponse.name,
              accountDescription: accountResponse.description,
              accountEIN: accountResponse.ein,
              accountEmail: accountResponse.email,
              accountStatus: accountResponse.status,
              accountPhone: accountResponse.phone,
              addressName: accountResponse.address[0].addressName,
              addressId: accountResponse.address[0].id,
              address1: accountResponse.address[0].address1,
              address2: accountResponse.address[0].address2,
              address3: accountResponse.address[0].address3,
              city: accountResponse.address[0].city,
              state: accountResponse.address[0].state,
              zipCode: accountResponse.address[0].zipCode,
              country: accountResponse.address[0].country
          };
  
          setAccount(accountData);
  
          // get user and set form fields
              const fields = ['accountName', "accountDescription", "accountStatus", "accountEIN","accountEmail","accountPhone", "addressName","address1", "address2", "address3","city","state","zipCode","accountPhone"];
              fields.forEach(field => setValue(field, accountData[field]));
      }
  
    }

    getAccountDetailsAPICall();
  }, []);
  
  function onSubmit(data) {
    
    console.log("Datattata::"+JSON.stringify(data))
    return isAddMode
        ? createAccount(data)
        : updateAccount(accountId, data);
}

  // Create Account 
  const createAccount = async (formData) => {
    try {
        const data = await accountService.createAccount(formData);

        if(data.error) {
          toast({
            title: 'Add account error.',
            description: 'Error whild adding new account, Please try again or contact administrator.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })       
        }else {
          toast({
            title: 'Account added.',
            description: 'Successfully added new account.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })    
          router.push("/accounts");  
        }
      
    } catch (error) {
      toast({
        title: 'Add account error.',
        description: 'Error whild adding new account, Please try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })   
    }
  };



  // update invoice in database
  const updateAccount = async (accountId, formData) => {
    try {
      const data = await accountService.updateAccount(accountId, formData, account.addressId)
      if(data.error) {
        toast({
          title: 'Update account error.',
          description: 'Error whild updating account, Please try again or contact administrator.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })    
      }else {
        router.push(`/account/detail`);
        toast({
          title: 'Account updated.',
          description: 'Successfully update account.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })  
      }


    } catch (error) {
      console.log(error)
      toast({
        title: 'Update account error.',
        description: 'Error whild updating account, Please try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })  
    }
  };


  return (

    <div>
      {isPageAuthprized ? (
        <div> 
          {isAddMode ? (
              <PageMainHeader heading="New Account"/>
          ) : (
              <PageMainHeader heading="Update Account"/>
          )}              
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>Account Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack>
                        <FormControl isRequired>
                          <FormLabel>Account Name</FormLabel>
                          <Input type="text" {...register('accountName')}  id="accountName"   maxWidth="page.single_input"/>
                        </FormControl>     
                        <FormControl isRequired>
                            <FormLabel>Account Descirption</FormLabel>
                            <Input type="text" id="accountDescription" {...register('accountDescription')}   maxWidth="page.single_input"/>
                        </FormControl>   
                        <HStack spacing="15rem">
                          <Box>
                          <FormControl isRequired>
                            <FormLabel>Account EIN</FormLabel>
                            <Input type="text" id="accountEIN"   {...register('accountEIN')} />
                          </FormControl>  
                          </Box>
                          <Box>
                          <FormControl isRequired>
                            <FormLabel>Account Status</FormLabel>
                            <Select id="accountStatus" {...register('accountStatus')} >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Select>
                          </FormControl>     
                          </Box>
                        </HStack>   
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader>
                  <Heading size='xs'>Account Contact</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacing="10rem">
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Account Email</FormLabel>
                          <Input type="email" id="accountEmail"   {...register('accountEmail')}  />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Account Phone</FormLabel>
                            <Input type="tel" id="accountPhone"   {...register('accountPhone')}  onChange={(ev) => handlePhoneInput(ev.target.value)} />
                          </FormControl>      
                      </Box>                                                                    
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size='xs'>Account Addreses</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack maxWidth="page.single_input" spacing="1rem">
                        <FormControl isRequired>
                          <FormLabel>Address Name</FormLabel>
                          <Input type="text" id="addressName"   {...register('addressName')} />
                        </FormControl>                         
                        <FormControl isRequired>
                          <FormLabel>Address1</FormLabel>
                          <Input type="text" id="address1"   {...register('address1')} />
                        </FormControl>    
                        <HStack>
                          <FormControl>
                            <FormLabel>Address2</FormLabel>
                            <Input type="text" id="address2"   {...register('address2')} />
                          </FormControl>     
                          <FormControl>
                            <FormLabel>Address3</FormLabel>
                            <Input type="text" id="address3"   {...register('address3')} />
                          </FormControl>     
                        </HStack>
                      <HStack>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>City</FormLabel>
                            <Input type="text" id="city"   {...register('city')} />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>State</FormLabel>
                            <Select id="state" {...register('state')} >
                              <option value="">State</option>
                              {US_STATES?.map((state) => (
                                  <option value={state.id}>{state.name}</option>
                                  ))}
                            </Select>
                          </FormControl>     
                        </Box>
                        </HStack>
                        <HStack>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>ZipCode</FormLabel>
                            <Input type="text" id="zipCode"   {...register('zipCode')} />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Country</FormLabel>
                            <Select id="country" {...register('country')} >
                              <option value="USA">USA</option>
                            </Select>

                          </FormControl>     
                        </Box>                                                                        
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>


                <Flex marginBottom={4}>
                  <HStack>
                    <Box>
                      <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </Box>
                    <Box>
                      <Button size="xs" bgColor="header_actions"  type="submit">
                        {isAddMode ? (
                            <>Add</>
                        ) : (
                            <>Update</>
                        )}
                      </Button>
                    </Box>
                  </HStack>
                </Flex>                   
              </Stack>
            </form>          
          </Box>

        </div>
      ) : (
        <> 
        <PageNotAuthorized/>
      </>
      )}
    </div>


  );
};

export default AccountAddEdit;
