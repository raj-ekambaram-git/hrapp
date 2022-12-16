import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, VENDOR_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";
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
  StackDivider
} from '@chakra-ui/react'

const VendorEdit = (props) => {
  
  const vendorId = props.data.vendorId;
  const router = useRouter();
  const description = useRef("");
  const email = useRef("");
  const type = useRef("");
  const phone = useRef("");
  const accountId = useRef("");
  const ein = useRef("");
  const status = useRef("");
  const accountContactName = useRef("");
  const accountContactEmail = useRef("");
  const accountContactPhone = useRef("");
  const address1 = useRef("");
  const address2 = useRef("");
  const address3 = useRef("");
  const city = useRef("");
  const country = useRef("");
  const state = useRef("");
  const zipCode = useRef("");
  const addressId = useRef("");

  const [vendor, setVendor] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  
  
  //User Validation START
  const formOptions = { resolver: yupResolver(VENDOR_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;


  const handlePhoneInput = (e) => {
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e.target.value);
    // we'll set the input value using our setInputValue
    setValue(accountPhone, formattedPhoneNumber);
    // setAccountPhone(formattedPhoneNumber);
  };
  //Account Validation END

  const navigateVendorListPage = () => router.push({ pathname: '/account/'+userService.getAccountDetails().accountId+'/vendors', query: {} });

  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }
    setValue("accountId",userService.getAccountDetails().accountId);

    if(userService.isAccountAdmin() || userService.isSuperAdmin()) {
      setPageAuthorized(true);
    }

    getVendorDetailsAPICall();

  }, []);


  async function getVendorDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      
      const vendorResponse = await accountService.getVendorDetail(props.data.vendorId, userService.getAccountDetails().accountId);
        const vendorData =  {
            id: vendorResponse.id.toString(),
            name: vendorResponse.name,
            description: vendorResponse.description,
            email: vendorResponse.email,
            type: vendorResponse.type,
            phone: vendorResponse.phone,
            accountId: vendorResponse.accountId,
            ein: vendorResponse.ein,
            status: vendorResponse.status,
            accountContactName: vendorResponse.accountContactName,
            accountContactEmail: vendorResponse.accountContactEmail,
            accountContactPhone: vendorResponse.accountContactPhone,
            addressId: vendorResponse.address[0].id,
            address1: vendorResponse.address[0].address1,
            address2: vendorResponse.address[0].address2,
            address3: vendorResponse.address[0].address3,
            city: vendorResponse.address[0].city,
            state: vendorResponse.address[0].state,
            zipCode: vendorResponse.address[0].zipCode,
            country: vendorResponse.address[0].country
        };

        setVendor(vendorData);

        // get user and set form fields
            const fields = ['name', "description", "email", "type","phone","accountId", "ein","status","accountContactName","accountContactEmail","accountContactPhone","address1", "address2", "address3","city","state","zipCode"];
            fields.forEach(field => setValue(field, vendorData[field]));
    }

  }

  function onSubmit(data) {
    
    return isAddMode
        ? createVendor(data)
        : updateVendor(vendorId, data);
  }

  // Create Account 
  const createVendor = async (formData) => {
    try {
        const res = await fetch("/api/account/vendor/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            address: {
              create: [
                {
                  type: "V",
                  address1: formData.address1,
                  address2: formData.address2,
                  address3: formData.address3,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                  country: formData.country,
                  status: "A"
                }
              ]
            },
            email: formData.email,
            type: formData.type,
            phone: formData.phone,
            accountId: parseInt(formData.accountId),
            ein: formData.ein,
            status: formData.status,
            accountContactName: formData.accountContactName,
            accountContactEmail: formData.accountContactEmail,
            accountContactPhone: formData.accountContactPhone
          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
        
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };



  // update invoice in database
  const updateVendor = async (vendorId, formData) => {
    console.log("JSON Data::"+JSON.stringify(formData))
    try {
      const res = await fetch(`/api/account/vendor/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(vendorId),
          name: formData.name,
          description: formData.description,
          address: {
            update: {
              where: {
                id: vendor.addressId,
              },
              data:
              {
                type: "V",
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                status: "A"
              }
            }
          },
          email: formData.email,
          type: formData.type,
          phone: formData.phone,
          accountId: parseInt(formData.accountId),
          ein: formData.ein,
          status: formData.status,
          accountContactName: formData.accountContactName,
          accountContactEmail: formData.accountContactEmail,
          accountContactPhone: formData.accountContactPhone

        }),
      });

      const data = await res.json();
      
      router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
      toast.success(data.message);
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!");
    }
  };


  return (
    <div>
      {isPageAuthprized ? (
        <div> 
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="heading"
            color="white"
            marginBottom="2rem"
            width="50%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
               {isAddMode ? (
                    <div>New Vendor</div>
                ) : (
                    <div>Update Vendor</div>
                )}              
            </Heading>
          </Flex>
          <Box width="50%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Vendor Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Vendor Name</FormLabel>
                          <Input type="text" {...register('name')}  id="name"  size="md" />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Vendor Descirption</FormLabel>
                            <Input type="text" id="description" {...register('description')}  size="md" />
                        </FormControl>    
                      </Box>  
                      <HStack spacing={8}>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Vendor Status</FormLabel>
                            <Select width="100%" id="status" {...register('status')} >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Error">Error</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Vendor Type</FormLabel>
                            <Select width="100%" id="type" {...register('type')} >
                              <option value="Staffing">Staffing</option>
                              <option value="Product">Product</option>
                              <option value="Project">Project</option>
                            </Select>
                          </FormControl>     
                        </Box>  
                      </HStack>                          
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Account EIN</FormLabel>
                          <Input type="text" id="ein"  size="md" {...register('ein')}  />
                        </FormControl>     
                      </Box>                                                                                                         
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Vendor Contact</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Vendor Email</FormLabel>
                          <Input type="email" id="email"  size="md" {...register('email')}  />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Account Phone</FormLabel>
                            <Input type="text" id="phone"  size="md" {...register('phone')}  />
                          </FormControl>      
                      </Box>                                                                    
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader bgColor="table_tile">
                    <Heading size='sm'>Vendor Addreses</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Address1</FormLabel>
                          <Input type="text" id="address1"  size="md" {...register('address1')} />
                        </FormControl>     
                        <FormControl>
                          <FormLabel>Address2</FormLabel>
                          <Input type="text" id="address2"  size="md" {...register('address2')} />
                        </FormControl>     
                        <FormControl>
                          <FormLabel>Address3</FormLabel>
                          <Input type="text" id="address3"  size="md" {...register('address3')} />
                        </FormControl>     
                      </Box>
                      <HStack>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>City</FormLabel>
                            <Input type="text" id="city"  size="md" {...register('city')} />
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
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>ZipCode</FormLabel>
                            <Input type="text" id="zipCode"  size="md" {...register('zipCode')} />
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
                <Card>
                  <CardHeader bgColor="table_tile">
                    <Heading size='sm'>Account Contact</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <HStack>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Account Contact Name</FormLabel>
                            <Input type="text" id="accountContactName"  size="md" {...register('accountContactName')}  />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Account Contact Email</FormLabel>
                            <Input type="email" id="accountContactEmail"  size="md" {...register('accountContactEmail')}  />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                              <FormLabel>Account ContactPhone</FormLabel>
                              <Input type="text" id="accountContactPhone"  size="md" {...register('accountContactPhone')}  />
                            </FormControl>      
                        </Box>                                                                    
                        </HStack>
                      </Stack>
                  </CardBody>
                </Card>

                <Flex marginBottom={4}>
                  <HStack>
                    <Box>
                    <Button className="btn" onClick={navigateVendorListPage}>
                        Discard
                      </Button>
                    </Box>
                    <Box>
                      <Button type="submit">
                        {isAddMode ? (
                            <>Add New Vendor</>
                        ) : (
                            <>Update Vendor</>
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
      )}
    </div>

  );
};

export default VendorEdit;
