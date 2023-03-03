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
              accountType: accountResponse.type,
              accountDescription: accountResponse.description,
              accountEIN: accountResponse.ein,
              accountEmail: accountResponse.email,
              accountStatus: accountResponse.status,
              accountPhone: accountResponse.phone,
              addressName: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].addressName:null,
              addressId: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].id:null,
              address1: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].address1:null,
              address2: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].address2:null,
              address3: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].address3:null,
              city: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].city:null,
              state: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].state:null,
              zipCode: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].zipCode:null,
              country: accountResponse.address&& accountResponse.address.length>0?accountResponse.address[0].country:null
          };
  
          setAccount(accountData);
  
          // get user and set form fields
              const fields = ['accountName', "accountDescription", "accountType", "accountStatus", "accountEIN","accountEmail","accountPhone", "addressName","address1", "address2", "address3","city","state","zipCode","accountPhone"];
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
                  <Stack spacing={6}>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('accountName')}  id="accountName"   maxWidth="page.single_input"/>
                          <FormLabel>Name</FormLabel>
                        </FormControl>     
                        <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="accountDescription" {...register('accountDescription')}   maxWidth="page.single_input"/>
                            <FormLabel>Descirption</FormLabel>
                        </FormControl>   
                        <HStack spacing="15rem">
                          <Box>
                          <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="accountEIN"   {...register('accountEIN')} />
                            <FormLabel>EIN</FormLabel>
                          </FormControl>  
                          </Box>
                          <Box>
                            <FormControl isRequired>                              
                              <Select id="accountStatus" {...register('accountStatus')} >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                              </Select>
                              <FormLabel>Status</FormLabel>
                            </FormControl>     
                          </Box>
                          <Box>
                            <FormControl isRequired>                              
                              <Select id="accountType" {...register('accountType')} >
                                  <option value="Trial">Trial</option>
                                  <option value="Full">Full</option>
                              </Select>
                              <FormLabel>Type</FormLabel>
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
                          <Input  placeholder=" " type="email" id="accountEmail"   {...register('accountEmail')}  />
                          <FormLabel>Account Email</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>                            
                            <Input  placeholder=" " type="tel" id="accountPhone"   {...register('accountPhone')}  onChange={(ev) => handlePhoneInput(ev.target.value)} />
                            <FormLabel>Account Phone</FormLabel>
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
                    <Stack maxWidth="page.single_input" spacing={6}>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" id="addressName"   {...register('addressName')} />
                          <FormLabel>Address Name</FormLabel>
                        </FormControl>                         
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" id="address1"   {...register('address1')} />
                          <FormLabel>Address1</FormLabel>
                        </FormControl>    
                        <HStack>
                          <FormControl>                            
                            <Input  placeholder=" " type="text" id="address2"   {...register('address2')} />
                            <FormLabel>Address2</FormLabel>
                          </FormControl>     
                          <FormControl>                            
                            <Input  placeholder=" " type="text" id="address3"   {...register('address3')} />
                            <FormLabel>Address3</FormLabel>
                          </FormControl>     
                        </HStack>
                      <HStack>
                        <Box>
                          <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="city"   {...register('city')} />
                            <FormLabel>City</FormLabel>
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>                            
                            <Select id="state" {...register('state')} >
                              <option value="">State</option>
                              {US_STATES?.map((state) => (
                                  <option value={state.id}>{state.name}</option>
                                  ))}
                            </Select>
                            <FormLabel>State</FormLabel>
                          </FormControl>     
                        </Box>
                        </HStack>
                        <HStack>
                        <Box>
                          <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="zipCode"   {...register('zipCode')} />
                            <FormLabel>ZipCode</FormLabel>
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>                            
                            <Select id="country" {...register('country')} >
                              <option value="USA">USA</option>
                            </Select>
                            <FormLabel>Country</FormLabel>
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
