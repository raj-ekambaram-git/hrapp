import React, { useState } from "react";

import {

    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Stack,
    useDisclosure,
    useToast,
    HStack,
    Input,
    Checkbox,
    Select,
    Card,
    CardHeader,
    CardBody,
    Heading,
    FormControl,
    FormLabel,
    Badge

  } from '@chakra-ui/react';
  
import { useDispatch } from "react-redux";
import { ConfigConstants, EMPTY_STRING, US_STATES } from "../../../constants";
import { configurationService, userService } from "../../../services";
import { AccountType } from "@prisma/client";
import { util } from "../../../helpers";

const AccountVerify = (props) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [size, setSize] = useState('');
    const [isAddMode, setAddMode] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [accountName, setAccountName] = useState();
    const [accountEIN, setAccountEIN] = useState();
    const [accountFirstName, setAccountFirstName] = useState();
    const [accountLastName, setAccountLastName] = useState();
    const [accountEmail, setAccountEmail] = useState();
    const [ipAddress, setIpAddress] = useState();
    const [accountAddress1, setAccountAddress1] = useState();
    const [accountCity, setAccountCity] = useState();
    const [accountState, setAccountState] = useState();
    const [accountZipCode, setAccountZipCode] = useState();
    const [controllerFirstName, setControllerFirstName] = useState();
    const [controllerLastName, setControllerLastName] = useState();
    const [controllerTitle, setControllerTitle] = useState();
    const [controllerDOB, setControllerDOB] = useState();
    const [controllerLastFour, setControllerLastFour] = useState();
    const [controllerAddress1, setControllerAddress1] = useState();
    const [controllerAddress2, setControllerAddress2] = useState();
    const [controllerCity, setControllerCity] = useState();
    const [controllerState, setControllerState] = useState();
    const [controllerZipCode, setControllerZipCode] = useState();
    const [controllerCountry, setControllerCountry] = useState();
    const [businessClassification, setBusinessClassification] = useState();
    const [businessType, setBusinessType] = useState();
    const [accountVerificationConsent, setAccountVerificationConsent] = useState();
    

  
    function handleVerifyAccount(newSize) {
        setSize(newSize);
        onOpen();
        if(props.accountDetails) {
            setAddMode(false)
            setAccountName(props.accountDetails.name)
            setAccountEmail(props.accountDetails.email)
            setAccountEIN(props.accountDetails.ein)
            setAccountAddress1(props.accountDetails.address[0]?.address1)
            setAccountCity(props.accountDetails.address[0]?.city)
            setAccountState(props.accountDetails.address[0]?.state)
            setAccountZipCode(props.accountDetails.address[0]?.zipCode)
            
            setControllerFirstName(props.accountDetails.user[0]?.firstName)
            setControllerLastName(props.accountDetails.user[0]?.lastName)
            setControllerAddress1(props.accountDetails.user[0]?.address[0]?.address1)
            setControllerAddress2(props.accountDetails.user[0]?.address[0]?.address2)
            setControllerCity(props.accountDetails.user[0]?.address[0]?.city)
            setControllerState(props.accountDetails.user[0]?.address[0]?.state)
            setControllerZipCode(props.accountDetails.user[0]?.address[0]?.zipCode)
            setControllerCountry("US")
            
        }
      }

    const handleAccountVerify = async () => {
        if(accountVerificationConsent) {
            console.log("accountName:::"+accountName)
            console.log("accountEIN:::"+accountEIN)
            console.log("accountEmail:::"+accountEmail)
            console.log("businessType:::"+businessType)
            console.log("businessClassification:::"+businessClassification)
            console.log("accountAddress1:::"+accountAddress1)
            console.log("accountCity:::"+accountCity)
            console.log("accountState:::"+accountState)
            console.log("accountZipCode:::"+accountZipCode)
            console.log("controllerFirstName:::"+controllerFirstName)
            console.log("controllerLastName:::"+controllerLastName)
            console.log("controllerTitle:::"+controllerTitle)
            console.log("controllerLastFour:::"+controllerLastFour)
            console.log("controllerDOB:::"+controllerDOB)
            console.log("controllerAddress1:::"+controllerAddress1)
            console.log("controllerCity:::"+controllerCity)
            console.log("controllerState:::"+controllerState)
            console.log("controllerZipCode:::"+controllerZipCode)
            console.log("controllerCountry:::"+controllerCountry)


            if(accountName && accountEIN && accountEmail && util.isValidEmail(accountEmail) && businessType
                && businessClassification && accountAddress1 && accountCity
                && accountState && accountZipCode
                && controllerFirstName && controllerLastName && controllerTitle
                && controllerLastFour && controllerDOB && util.isValidDOB(controllerDOB) && controllerAddress1 
                && controllerCity && controllerState && controllerZipCode && controllerCountry) {

                const verificationRequestData = {
                    firstName: controllerFirstName,
                    lastName: controllerLastName,
                    email: accountEmail,
                    ipAddress: "143.156.7.8",
                    type: "business",
                    address1: accountAddress1,
                    city: accountCity,
                    state: accountState,
                    postalCode: accountZipCode,
                    controller: {
                        firstName: controllerFirstName,
                        lastName: controllerLastName,
                        title: controllerTitle,
                        ssn: controllerLastFour,
                        dateOfBirth: controllerDOB,
                        address: {
                            address1: controllerAddress1,
                            address2: controllerAddress2,
                            city: controllerCity,
                            stateProvinceRegion: controllerState,
                            postalCode: controllerZipCode,
                            country: controllerCountry                            
                        }
                    },
                    businessClassification: "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
                    businessType: "llc",
                    businessName: accountName,
                    ein: accountEIN
                }

                console.log("verificationRequestData:::::"+JSON.stringify(verificationRequestData))
                

            } else {

                toast({
                    title: 'Account Verification.',
                    description: 'All the fields are required and in specific format, please enter all the required fields and try again.',
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                  })     
                  return;
            }

        } else {
            toast({
                title: 'Account Verification.',
                description: 'Please accept the consent to verify your account.',
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })     
              return;
        }
    }

    return (
        <>
          <Button size="xs" colorScheme="red"
              onClick={() => handleVerifyAccount("lg")}
              key="lg"
              m={1}
              >{`Verify Account`}
          </Button>

          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Verify Account
                        </DrawerHeader>
                        <DrawerBody>
                          <Stack spacing={1} marginTop={3}>
                            <Card>
                                <CardHeader>
                                    <Heading size="xs">Account Details</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Stack spacing={1} marginTop={1}>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Account Name</FormLabel>
                                                    <Input type="text" value={accountName} id="accountName" onChange={(ev) => setAccountName(ev.target.value)}  />
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>EIN</FormLabel>
                                                    <Input type="text"  value={accountEIN} id="accountEIN"  onChange={(ev) => setAccountEIN(ev.target.value)} />
                                                </FormControl>                                                                           
                                            </HStack>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Email</FormLabel>
                                                    <Input type="email"  value={accountEmail} id="accountEmail" onChange={(ev) => setAccountEmail(ev.target.value)}  />
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>Type</FormLabel>
                                                    <Badge>Businesss</Badge>
                                                </FormControl>                                                                           
                                            </HStack>   
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Business Tyoe</FormLabel>
                                                    <Select  value={businessType} onChange={(ev) => setBusinessType(ev.target.value)} border="table_border">
                                                        <option value="">Select Business Type</option>
                                                        {ConfigConstants.AVAILABLE_ACCOUNT_BUSINESS_TYPES?.map((businessType) => (
                                                                <option value={businessType.id}>{businessType.name}</option>
                                                        ))}                                           
                                                    </Select>
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>Business Classification</FormLabel>
                                                    <Select  value={businessClassification} onChange={(ev) => setBusinessClassification(ev.target.value)} border="table_border">
                                                        <option value="">Select Business Classification</option>
                                                        {ConfigConstants.AVAILABLE_ACCOUNT_BUSINESS_CLASSIFICATIONS?.map((businessClassification) => (
                                                                <option value={businessClassification.id}>{businessClassification.name}</option>
                                                        ))}                                           
                                                    </Select>
                                                </FormControl>                                                                           
                                            </HStack>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Address 1</FormLabel>
                                                    <Input type="text"  value={accountAddress1} id="accountAddress1" onChange={(ev) => setAccountAddress1(ev.target.value)}  />
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>City</FormLabel>
                                                    <Input type="text"  value={accountCity} id="accountCity" onChange={(ev) => setAccountCity(ev.target.value)}  />
                                                </FormControl>                                                                           
                                            </HStack>      
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>State</FormLabel>
                                                    <Select id="accountStatue" value={accountState} onChange={(ev) => setAccountState(ev.target.value)}  >
                                                        <option value="">State</option>
                                                        {US_STATES?.map((state) => (
                                                            <option value={state.id}>{state.name}</option>
                                                            ))}
                                                    </Select>
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>ZipCode</FormLabel>
                                                    <Input type="text"  value={accountZipCode} id="accountZipCode"  onChange={(ev) => setAccountZipCode(ev.target.value)} />
                                                </FormControl>                                                                           
                                            </HStack>                                                                                     
                                    </Stack>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Heading size="xs">Account Controller Details</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Stack spacing={1} marginTop={1}>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>First Name</FormLabel>
                                                    <Input type="text" value={controllerFirstName} id="controllerFirstName"  onChange={(ev) => setControllerFirstName(ev.target.value)} />
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <Input type="text"  value={controllerLastName} id="controllerLastName"  onChange={(ev) => setAccountLastName(ev.target.value)} />
                                                </FormControl>                                                                           
                                            </HStack>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Title</FormLabel>
                                                    <Select  value={controllerTitle} onChange={(ev) => setControllerTitle(ev.target.value)} border="table_border">
                                                        <option value="">Select Title</option>
                                                        {ConfigConstants.AVAILABLE_TITLES?.map((title) => (
                                                                <option value={title.id}>{title.name}</option>
                                                        ))}                                           
                                                    </Select>
                                                </FormControl>       
                                                <FormControl isRequired>
                                                    <FormLabel>Last 4 SSN</FormLabel>
                                                    <Input type="password"  value={controllerLastFour} id="controllerLastFour" onChange={(ev) => setControllerLastFour(ev.target.value)}  />
                                                </FormControl>                                                                           
                                            </HStack>   
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <Input type="text" width="38%" placeholder="1980-01-31" value={controllerDOB} id="controllerDOB"  onChange={(ev) => setControllerDOB(ev.target.value)} />
                                                </FormControl>                                                                                
                                            </HStack>
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>Address 1</FormLabel>
                                                    <Input type="text"  value={controllerAddress1} id="controllerAddress1"  onChange={(ev) => setControllerAddress1(ev.target.value)} />
                                                </FormControl>       
                                                <FormControl>
                                                    <FormLabel>Address 2</FormLabel>
                                                    <Input type="text"  value={controllerAddress2} id="controllerAddress2"  onChange={(ev) => setControllerAddress2(ev.target.value)} />
                                                </FormControl>                                                                           
                                            </HStack>      
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>City</FormLabel>
                                                    <Input type="text"  value={controllerCity} id="controllerCity" onChange={(ev) => setControllerCity(ev.target.value)}  />
                                                </FormControl>   
                                                <FormControl isRequired>
                                                    <FormLabel>State</FormLabel>
                                                    <Select id="controllerState" value={controllerState} onChange={(ev) => setControllerState(ev.target.value)}  >
                                                        <option value="">State</option>
                                                        {US_STATES?.map((state) => (
                                                            <option value={state.id}>{state.name}</option>
                                                            ))}
                                                    </Select>
                                                </FormControl>                                                                               
                                            </HStack>   
                                            <HStack spacing="150px">
                                                <FormControl isRequired>
                                                    <FormLabel>ZipCode</FormLabel>
                                                    <Input type="text"  value={controllerZipCode} id="controllerZipCode" onChange={(ev) => setControllerZipCode(ev.target.value)}  />
                                                </FormControl>     
                                                <FormControl isRequired>
                                                    <FormLabel>Country</FormLabel>
                                                    <Select id="controllerCountry" value={controllerCountry} onChange={(ev) => setControllerCountry(ev.target.value)}  >
                                                        <option value="US">USA</option>
                                                    </Select>
                                                </FormControl>                                                                              
                                            </HStack>                                                                                                                                 
                                    </Stack>
                                </CardBody>
                            </Card>          
                            <FormControl isRequired>
                                <FormLabel>Account Consent</FormLabel>
                                    <Checkbox
                                        isChecked={accountVerificationConsent?true:false}
                                        onChange={(e) => setAccountVerificationConsent(e.target.checked)}
                                    />                             
                                </FormControl>                                                
                            <Button width="30%" marginTop="30px" onClick={() => handleAccountVerify()} bgColor="header_actions">
                                Verify
                            </Button>                                                                                                        
                          </Stack>
                        </DrawerBody>
                    </DrawerContent>
           </Drawer>                      
        </>
    );
};

export default AccountVerify;