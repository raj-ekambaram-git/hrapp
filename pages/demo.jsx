import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from '../components/static/Layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountService, configurationService, emailService } from "../services";
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
  ListIcon,
  Text

} from '@chakra-ui/react'
import { util } from "../helpers/util";
import Head from "next/head";
import { FooterSection } from "../components/static/FooterSection";
import Script from "next/script";
import { Spinner } from "../components";
import { CiUser } from 'react-icons/ci';
import { MdCheckCircle } from "react-icons/md";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { CommonConstants, EmailConstants } from "../constants";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

const RequestDemo = (props) => {
  const router = useRouter();
  const toast = useToast();
  const firstName = useRef("");
  const lastName = useRef("");
  const email = useRef("");
  const companyName = useRef("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
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
              title: 'Request Demo error.',
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

        const data = emailService.sendEmail({
            withAttachment: false,
            from: CommonConstants.fromEmail,
            to: formData.email,
            bcc: CommonConstants.demoRequestEmail,
            templateData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              companyName: formData.companyName,
              phone: formData.phone
            },
            template_id: EmailConstants.emailTemplate.requestDemo,
            subject: "Demo Request",
          });

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
          setSuccessMessage(true)
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
        src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}/>
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
                    <Stack spacing={[4, 1]}
                      alignItems="center"
                      direction={["column", null]}
                      w=""
                      h="full">                      
                      {successMessage?<>
                        <Heading size='xl'>BackOfficeNeeds Demo Requested</Heading>             
                      </>:<>
                        <Heading size='xl'>Demo BackOfficeNeeds</Heading>             
                        <Heading size='md' color="gray.500">Request a product demo with a solution expert.</Heading>
                      </>}                                 
                    </Stack>
                    {successMessage?<>
                      <Stack spacing={[4, 8]}
                          alignItems="center"
                          direction={["column", ""]}
                          w=""
                          h="full">    
                          <Stack alignItems="center">
                            <Text>
                              Thank you for your interest in our platform! We would be happy to provide you with a demo so you can see all of the features and capabilities that our platform offers.
                            </Text>                        
                            <Text>
                              During the demo, one of our representatives will guide you through the platform and show you how it can help you achieve your goals.
                            </Text>
                            <Text>
                              We look forward to showing you how our platform can benefit your business!
                            </Text>
                          </Stack>                            
                          <Button  size="xs" width="20%" colorScheme="teal" onClick={() => router.back()}>
                            Home
                          </Button>
                      </Stack>
                    </>:<>
                      <Stack spacing={[4, 9]}                    
                        direction={["column", "row"]}    
                        w=""
                        h="full">
                          <Stack maxWidth="500px" spacing={5}>
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
                                      <Input  placeholder=" " type="email" {...register('email')}  id="email" />
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
                                      <Input  placeholder=" " type="text" {...register('phone')}  id="phone" onChange={(ev) => handlePhoneInput(ev.target.value)}/>
                                      <FormLabel>Phone</FormLabel>
                                    </InputGroup>                                       
                                  </FormControl>     
                                </HStack>     
                                <Stack maxW={400} spacing={3}>
                                  <Button size="xs" width="60%" alignSelf="center" disabled={formState.isSubmitting} bgColor="header_actions"  type="submit" className="g-recaptcha" data-sitekey="reCAPTCHA_site_key"  >
                                      {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Request Demo
                                  </Button>     
                                  <Heading fontSize={11} alignContent="center" color="gray.500">By clicking "Request Demo", I accept the boNeeds Terms of Service and Privacy Notice.</Heading>                                                                                                                                                                                                          
                                </Stack>
                            </Stack>                            
                          </form>  
                      </Stack>     
                    </>}        
                  </Stack>
              </Container>
            </Center>              
            <FooterSection/>          
          </Layout>
    </>



  );
};

export default RequestDemo;
