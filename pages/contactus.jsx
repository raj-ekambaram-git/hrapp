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
  Text,
  Textarea

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

const ContactUs = (props) => {
  const router = useRouter();
  const toast = useToast();
  const firstName = useRef("");
  const lastName = useRef("");
  const email = useRef("");
  const message = useRef("");
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
              title: 'Contact Us error.',
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
            bcc: CommonConstants.contactUsEmail,
            templateData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              message: formData.message,
              phone: formData.phone
            },
            template_id: EmailConstants.emailTemplate.contactUs,
            subject: "Contact Us",
          });

        if(data.error) {
          toast({
            title: 'Contact Us.',
            description: data.errorMessage,
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })       
        }else {
          toast({
            title: 'Contact Us.',
            description: 'Thanks for contact us!.',
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
        title: 'Contact Us.',
        description: "Error contacting us. Details: "+error,
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
          <title>Contact Us Page</title>
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
                        <Heading size='xl'>Thanks for contact us.</Heading>             
                      </>:<>
                        <Heading size='xl'>Get in touch with us.</Heading>             
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
                              Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
                            </Text>                        
                            <Text>
                              Our team will review your request and reach out to you with more information or to schedule a demo, depending on your inquiry. We strive to respond to all inquiries within 24-48 hours, but please allow for additional time during weekends or holidays.
                            </Text>
                            <Text>
                              In the meantime, feel free to explore our website and learn more about our platform and the services we offer. We look forward to the opportunity to assist you and help your business grow online.
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
                                  src='boNeeds/contact-us.png'
                                  width={[400, 500]}
                                  height={[200, 300]}
                                  alt={`Request Demo`}
                                />
                            </Box>                                                  
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
                                          children={<PhoneIcon color='gray.300' />}
                                      />     
                                      <Input  placeholder=" " type="text" {...register('phone')}  id="phone" onChange={(ev) => handlePhoneInput(ev.target.value)}/>
                                      <FormLabel>Phone</FormLabel>
                                    </InputGroup>                                       
                                  </FormControl>     
                                </HStack>   
                                <HStack spacing={4}>                                   
                                  <FormControl isRequired>                                      
                                    <InputGroup>                            
                                      <InputLeftElement                                        
                                      />     
                                      <Textarea  placeholder=" " type="text" {...register('message')}  id="message" />
                                      <FormLabel>Message</FormLabel>
                                    </InputGroup>                                       
                                  </FormControl>     
                                </HStack>                                     
                                <Stack maxW={400} spacing={3}>
                                  <Button size="xs" width="60%" alignSelf="center" disabled={formState.isSubmitting} bgColor="header_actions"  type="submit" className="g-recaptcha" data-sitekey="reCAPTCHA_site_key"  >
                                      {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Submit
                                  </Button>     
                                  <Heading fontSize={11} alignContent="center" color="gray.500">By clicking "Submit", I accept the boNeeds Terms of Service and Privacy Notice.</Heading>                                                                                                                                                                                                          
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

export default ContactUs;
