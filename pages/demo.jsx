import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from '../components/static/Layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountService, configurationService } from "../services";
import {REGISTRATION_VALIDATION_SCHEMA} from "../constants/accountConstants";
import {
  HStack,
  Button,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Center,
  Container,
  Image,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react'
import { util } from "../helpers/util";
import Head from "next/head";
import { FooterSection } from "../components/static/FooterSection";
import Script from "next/script";
import { Spinner } from "../components";
import { CiUser } from 'react-icons/ci';
import { MdCheckCircle } from "react-icons/md";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

const RequestDemo = (props) => {
  const router = useRouter();
  const toast = useToast();
  const firstName = useRef("");
  const lastName = useRef("");
  const email = useRef("");
  const companyName = useRef("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const formOptions = { resolver: yupResolver(REGISTRATION_VALIDATION_SCHEMA) };
  const { register, handleSubmit, setValue, reset, formState } = useForm();
  const { errors } = formState;

  
  const handlePhoneInput = (e) => {
    const formattedPhoneNumber = util.formatPhoneNumber(e);
    setValue("phone", formattedPhoneNumber);
  };

  useEffect(() => {
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
            handleRequestDemo(data)
          }
        })      
    });      
  }

  const handleRequestDemo = async (formData) => {
    try {
      setLoading(true)
        const data = await accountService.registerAccount(formData);

        if(data.error) {
          toast({
            title: 'Request Demo.',
            description: data.errorMessage,
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })       
        }else {
          toast({
            title: 'Request Demo.',
            description: 'Successfully Request Demo, boNeeds representative will contact you soon.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })    
          setLoading(false)
          router.push("/");  
        }
      
    } catch (error) {
      toast({
        title: 'Request Demo.',
        description: "Error requesting a demo. Details: "+error,
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
          <title>Request Demo Page</title>
        </Head>
        <Script
        src={`https://www.google.com/recaptcha/api.js?render=6LeyNkUkAAAAAI6nmbpszuLJVBSVt9KP3ga0R6Db`}/>
        <Layout>
          <Center w="full" minH={["80vh", "90vh"]}>
            <Container maxW="container.xl" rounded="lg">
                <Stack
                    spacing={[4, 10]}
                    alignItems="center"
                    direction={["column", null]}
                    w=""
                    h="full"
                  >
                    <Stack spacing={[4, 4]}
                      alignItems="center"
                      direction={["column", null]}
                      w=""
                      h="full">

                      <Heading size='xl'>Demo BackOfficeNeeds</Heading>                        
                      <Heading size='md' color="gray.500">Request a product demo with a solution expert.</Heading>
                    </Stack>
                    <Stack spacing={[4, 9]}
                    
                      direction={["column", "row"]}    
                      w=""
                      h="full">
                        <Stack maxWidth="500px">
                          <Box>
                            <Image
                                src='boNeeds/request-demo.jpg'
                                width={[400, 500]}
                                height={[200, 300]}
                                alt={`Request Demo`}
                              />
                          </Box>                          
                          <Stack>
                              <Box>
                                    <Stack spacing={4}>
                                      <Heading size='md'>What to expect in demo?</Heading>                            
                                      <List spacing={3}>
                                        <ListItem>
                                          <ListIcon as={MdCheckCircle} color='teal.500' />
                                            A comprehensive overview of our platform and its capabilities.
                                        </ListItem>
                                        <ListItem>
                                          <ListIcon as={MdCheckCircle} color='teal.500' />
                                            Our representative will guide you through the various features and functionalities of our platform, providing a hands-on demonstration of how it works.
                                        </ListItem>
                                        <ListItem>
                                          <ListIcon as={MdCheckCircle} color='teal.500' />
                                            Our representative will also be available to answer any questions you may have and provide guidance on how to best use our platform to meet your business objectives.
                                        </ListItem>
                                        {/* You can also use custom icons from react-icons */}
                                        <ListItem>
                                          <ListIcon as={MdCheckCircle} color='teal.500' />
                                            Overall, you can expect to leave the demo with a clear understanding of how our platform can benefit your business and the next steps to get started.
                                        </ListItem>
                                      </List>  
                                    </Stack>                      
                              </Box>   
                            </Stack>                          
                        </Stack>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Stack spacing={8}>
                              <HStack spacing={4}>                                   
                                <FormControl isRequired>                                      
                                  <InputGroup>                            
                                    <InputLeftElement
                                        children={<CiUser color='gray.300' />}
                                    />     
                                    <Input  placeholder=" " type="text" {...register('firstName')}  id="firstName" />
                                    <FormLabel>First Name</FormLabel>
                                  </InputGroup>                                       
                                </FormControl>     
                                <FormControl isRequired>                                        
                                  <InputGroup>                            
                                    <InputLeftElement
                                        children={<CiUser color='gray.300' />}
                                    />     
                                    <Input  placeholder=" " type="text" {...register('lastName')}  id="lastName" />
                                    <FormLabel>Last Name</FormLabel>                                  
                                  </InputGroup>   
                                </FormControl>                                                                         
                              </HStack>
                              <HStack spacing={4}>                                   
                                <FormControl isRequired>                                      
                                  <InputGroup>                            
                                    <InputLeftElement
                                        children={<EmailIcon color='gray.300' />}
                                    />     
                                    <Input  placeholder="" type="text" {...register('email')}  id="email" />
                                    <FormLabel>Email</FormLabel>
                                  </InputGroup>                                       
                                </FormControl>                                                                         
                              </HStack>
                              <HStack spacing={4}>                                   
                                <FormControl isRequired>                                      
                                  <InputGroup>                            
                                    <InputLeftElement
                                        children={<CiUser color='gray.300' />}
                                    />     
                                    <Input  placeholder=" " type="text" {...register('companyName')}  id="companyName" />
                                    <FormLabel>Company Name</FormLabel>
                                  </InputGroup>                                       
                                </FormControl>     
                              </HStack>                      
                              <HStack spacing={4}>                                   
                                <FormControl isRequired>                                      
                                  <InputGroup>                            
                                    <InputLeftElement
                                        children={<PhoneIcon color='gray.300' />}
                                    />     
                                    <Input  placeholder=" " type="text" {...register('phone')}  id="phone" />
                                    <FormLabel>Phone</FormLabel>
                                  </InputGroup>                                       
                                </FormControl>     
                              </HStack>     

                                    <Button size="xs" width="60%" alignSelf="center" disabled={formState.isSubmitting} bgColor="header_actions"  type="submit" className="g-recaptcha" data-sitekey="reCAPTCHA_site_key"  >
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                      Request Demo
                                    </Button>                                                                                                                                                                                                               
                          </Stack>                            
                        </form>  
                    </Stack>     
                  </Stack>
              </Container>
            </Center>              
            <FooterSection/>          
          </Layout>
    </>



  );
};

export default RequestDemo;
