import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from '../components/static/Layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountService, userService } from "../services";
import {MODE_ADD, ACCOUNT_VALIDATION_SCHEMA, REGISTRATION_VALIDATION_SCHEMA} from "../constants/accountConstants";
import {US_STATES} from "../constants/commonConstants";
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
import { PageMainHeader } from "../components/common/pageMainHeader";
import { PageNotAuthorized } from "../components/common/pageNotAuthorized";
import { util } from "../helpers/util";
import Head from "next/head";
import { FooterSection } from "../components/static/FooterSection";
import { ErrorMessage } from "../constants/errorMessage";

const Register = (props) => {
  const router = useRouter();
  const toast = useToast();
  const accountName = useRef("");
  const accountDescription = useRef("");
  // const addressName = useRef("");
  // const address1 = useRef("");
  // const address2 = useRef("");
  // const address3 = useRef("");
  // const city = useRef("");
  // const country = useRef("");
  // const state = useRef("");
  // const zipCode = useRef("");
  const accountEIN = useRef("");
  const accountEmail = useRef("");
  const [accountPhone, setAccountPhone] = useState("");
  const [isAddMode, setAddMode] = useState(true);

  //Check if the mode is ADD or EDIT

  //Account Validation START
  const formOptions = { resolver: yupResolver(REGISTRATION_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm();
  const { errors } = formState;


  const handlePhoneInput = (e) => {
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e.target.value);
    // we'll set the input value using our setInputValue
    setValue(accountPhone, formattedPhoneNumber);
    // setAccountPhone(formattedPhoneNumber);
  };
  //Account Validation END



  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
  }, []);
  
  function onSubmit(data) {
    createAccount(data)
      // if(data.userPassword && data.userConfirmPassword && data.userPassword === data.userConfirmPassword) {
      //   createAccount(data)
      // }else {
      //   toast({
      //     title: 'Add account error.',
      //     description: ErrorMessage.PASSWORD_CONFIRM_SAME,
      //     status: 'error',
      //     position: 'top',
      //     duration: 6000,
      //     isClosable: true,
      //   })      
      // }
      
  }

  // Create Account 
  const createAccount = async (formData) => {
    try {
      console.log("formData::"+JSON.stringify(formData))
        const data = await accountService.registerAccount(formData);

        if(data.error) {
          toast({
            title: 'Add account error.',
            description: data.errorMessage,
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
          router.push("/login");  
        }
      
    } catch (error) {
      toast({
        title: ' Add account error.',
        description: "Details: "+error,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })   
    }
  };


  return (
    <>
        <Head>
          <title>Registration Page</title>
        </Head>
        <Layout>
          <Box bg="gray.50" width="1900">
              <PageMainHeader heading="Register New Account"/>          
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
                                  <FormControl>
                                    <FormLabel>Account EIN</FormLabel>
                                    <Input type="text" id="accountEIN"   {...register('accountEIN')} />
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
                          <HStack>
                            <Box>
                              <FormControl isRequired>
                                  <FormLabel>First Name</FormLabel>
                                  <Input type="tel" id="accountUserFirstName"   {...register('accountUserFirstName')}  />
                                </FormControl>      
                            </Box>  
                            <Box>
                              <FormControl isRequired>
                                  <FormLabel>Last Name</FormLabel>
                                  <Input type="tel" id="accountUserLastName"   {...register('accountUserLastName')}  />
                                </FormControl>      
                            </Box>  
                          </HStack>                          
                          <HStack spacing="10rem">
                            <Box>
                              <FormControl isRequired>
                                <FormLabel>Email (Logon ID)</FormLabel>
                                <Input type="email" id="accountEmail"   {...register('accountEmail')}  />
                              </FormControl>     
                            </Box>                                                                  
                            </HStack>
                            {/* <HStack>
                              <Box>
                                <FormControl isRequired>
                                  <FormLabel>Passowrd</FormLabel>
                                  <Input type="password" id="userPassword"   {...register('userPassword')}/>
                                </FormControl>     
                              </Box>  
                              <Box>
                                <FormControl isRequired>
                                  <FormLabel>Confirm Passowrd</FormLabel>
                                  <Input type="password" id="userConfirmPassword"   {...register('userConfirmPassword')}/>
                                </FormControl>     
                              </Box>  
                            </HStack> */}
                            <HStack>
                              <Box>
                                <FormControl isRequired>
                                    <FormLabel>Account Phone</FormLabel>
                                    <Input type="tel" id="accountPhone"   {...register('accountPhone')}  />
                                  </FormControl>      
                              </Box>  
                            </HStack>
                          </Stack>
                        </CardBody>
                      </Card>

                      {/* <Card>
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
                      </Card> */}
                      <Flex>
                        <HStack>
                          <Box>
                            <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                              Cancel
                            </Button>
                          </Box>
                          <Box>
                            <Button size="xs" bgColor="header_actions"  type="submit">
                              Register
                            </Button>
                          </Box>
                        </HStack>
                      </Flex>                   
                  </Stack>
                </form>          
              </Box>
            </Box>
            <FooterSection/>
          </Layout>
    </>



  );
};

export default Register;
