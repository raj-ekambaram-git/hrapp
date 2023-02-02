import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from '../components/static/Layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountService, configurationService } from "../services";
import {MODE_ADD, REGISTRATION_VALIDATION_SCHEMA} from "../constants/accountConstants";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  useToast,
  Center,
  Container
} from '@chakra-ui/react'
import { PageMainHeader } from "../components/common/pageMainHeader";
import { util } from "../helpers/util";
import Head from "next/head";
import { FooterSection } from "../components/static/FooterSection";
import Script from "next/script";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

const Register = (props) => {
  const router = useRouter();
  const toast = useToast();
  const accountName = useRef("");
  const accountDescription = useRef("");
  const accountEIN = useRef("");
  const accountEmail = useRef("");
  const [accountPhone, setAccountPhone] = useState("");
  const [isAddMode, setAddMode] = useState(true);

  const formOptions = { resolver: yupResolver(REGISTRATION_VALIDATION_SCHEMA) };
  const { register, handleSubmit, setValue, reset, formState } = useForm();
  const { errors } = formState;

  
  const handlePhoneInput = (e) => {
    const formattedPhoneNumber = util.formatPhoneNumber(e);
    setValue("accountPhone", formattedPhoneNumber);
  };

  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
  }, []);
  
  function onSubmit(data) {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then(async (token) => {
          const responseData = await configurationService.verifyCaptcha(token)
          if(responseData.error) {
            toast({
              title: 'Add account error.',
              description: data.errorMessage,
              status: 'error',
              position: 'top',
              duration: 6000,
              isClosable: true,
            })       
          }else {
            createAccount(data)
          }
        })      
    });      
  }

  // Create Account 
  const createAccount = async (formData) => {
    try {
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
        <Script
        src={`https://www.google.com/recaptcha/api.js?render=6LeyNkUkAAAAAI6nmbpszuLJVBSVt9KP3ga0R6Db`}/>
        <Layout>
          <Center w="full" minH={["80vh", "90vh"]}>
            <Container maxW="container.xl" rounded="lg">
                <Stack
                    spacing={[4, 8]}
                    alignItems="center"
                    direction={["column", null]}
                    w=""
                    h="full"
                  >
                    <Flex
                      as="nav"
                      align="center"
                      justify="space-between"
                      wrap="wrap"
                      padding="page.heading"
                      bg="heading"
                      color="white"
                      width={["370px","page.register_width"]}
                      borderRadius='9px'
                      >
                      <Heading size='md'>Register for an Account</Heading>
                    </Flex>  
                    <Box marginBottom={4} fontSize="13px" color="gray.500" alignSelf="left">
                      "Start your free trial with all the features enabled for a month.
                    </Box>
                    <Box width={[null, "page.sub_heading_width"]}>
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
                                        <Input type="text" id="accountUserFirstName"   {...register('accountUserFirstName')}  />
                                      </FormControl>      
                                  </Box>  
                                  <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input type="text" id="accountUserLastName"   {...register('accountUserLastName')}  />
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
                                  <HStack>
                                    <Box>
                                      <FormControl isRequired>
                                          <FormLabel>Account Phone</FormLabel>
                                          <Input type="tel" id="accountPhone"   {...register('accountPhone')}  onChange={(ev) => handlePhoneInput(ev.target.value)}/>
                                        </FormControl>      
                                    </Box>  
                                  </HStack>
                                </Stack>
                              </CardBody>
                            </Card>
                            <Flex>
                              <HStack>
                                <Box>
                                  <Button size="xs" colorScheme="yellow" onClick={() => router.back()}>
                                    Cancel
                                  </Button>
                                </Box>
                                <Box>
                                  <Button size="xs" disabled={formState.isSubmitting} bgColor="header_actions"  type="submit" className="g-recaptcha" data-sitekey="reCAPTCHA_site_key"  >
                                      {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Register
                                  </Button>                       
                                </Box>
                              </HStack>
                            </Flex>                   
                        </Stack>
                      </form>          
                    </Box>
                  </Stack>
              </Container>
            </Center>              
            <FooterSection/>          
          </Layout>
    </>



  );
};

export default Register;
