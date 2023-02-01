import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService, vendorService } from "../../services";
import {MODE_ADD, VENDOR_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";
import {US_STATES} from "../../constants/commonConstants";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
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
} from '@chakra-ui/react';
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedAccountId } from "../../store/modules/Account/actions";

const VendorEdit = (props) => {
  const dispatch = useDispatch();
  const vendorId = props.data.vendorId;
  const router = useRouter();
  const toast = useToast();
  const description = useRef("");
  const email = useRef("");
  const type = useRef("");
  const phone = useRef("");
  const ein = useRef("");
  const status = useRef("");
  const accountContactName = useRef("");
  const accountContactEmail = useRef("");
  const accountContactPhone = useRef("");
  const addressName = useRef("");
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
  // const [accountId, setAccountId] = useState(true);
  
  //Handle Account ID 
  const accountId = useSelector(state => state.account.selectedAccountId);

  //User Validation START
  const formOptions = { resolver: yupResolver(VENDOR_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;


  const handlePhoneInput = (e, fieldName) => {
    console.log("fieldName::"+fieldName)
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e);
    // we'll set the input value using our setInputValue
    setValue(fieldName, formattedPhoneNumber);
    // setAccountPhone(formattedPhoneNumber);
  };
  //Account Validation END

  const navigateVendorListPage = () => router.push({ pathname: '/account//vendors', query: {} });

  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    //Handle Account ID between the super account and others
    setValue("accountId",accountId);

    if(userService.isAccountAdmin() || userService.isSuperAdmin()) {
      setPageAuthorized(true);
    }

    getVendorDetailsAPICall();

  }, []);


  async function getVendorDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      
      const vendorResponse = await accountService.getVendorDetail(props.data.vendorId, accountId);
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
            addressName: vendorResponse.address[0].addressName,
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
        const fields = ['name', "description", "email", "type","phone","accountId", "ein","status","accountContactName","accountContactEmail","accountContactPhone","addressName","address1", "address2", "address3","city","state","zipCode"];
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
      console.log("Create Veendorrr::"+JSON.stringify(formData))
        const responseData = vendorService.createVendor(formData);
        if(responseData.error) {
          toast({
            title: 'Add Vendor Error.',
            description: 'Error creating a new vendor.',
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          })    
        }else {
          toast({
            title: 'Add new vendor',
            description: 'Successfullt added new vendor.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })    
          router.push("/account/vendors");
        }
    } catch (error) {
      toast({
        title: 'Add Vendor Error.',
        description: 'Please add all the required fields to add a vendor.',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })    
    }
  };



  // update invoice in database
  const updateVendor = async (vendorId, formData) => {
    console.log("JSON Data::"+JSON.stringify(formData))
    try {
      const responseData = vendorService.updateVendor(formData, vendorId, vendor.addressId)
      if(responseData.error) {
        toast({
          title: 'Update Vendor Error.',
          description: 'Error updating the vendor.',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })    
      } else {
        toast({
          title: 'Vendor Updated.',
          description: 'Successfully updated the vendor.',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })  
        router.push("/account/vendors");
      }

    } catch (error) {
      console.log(error)
      toast({
        title: 'Update Vendor Error.',
        description: 'Error updating the vendor.',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })    
    }
  };


  return (
    <div>
      {isPageAuthprized ? (
        <div> 
          
          {isAddMode ? (
              <PageMainHeader heading="New Vendor"/>
          ) : (
              <PageMainHeader heading="Update Vendor"/>
          )}     
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>Vendor Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Vendor Name</FormLabel>
                          <Input type="text" {...register('name')}  id="name"  maxWidth="page.single_input"/>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Vendor Descirption</FormLabel>
                            <Input type="text" id="description" {...register('description')}  maxWidth="page.single_input"/>
                        </FormControl>    
                      </Box>  
                      <HStack spacing={4}>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Vendor Status</FormLabel>
                            <Select width="100%" id="status" {...register('status')} size="sm">
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
                            <Select width="100%" id="type" {...register('type')}  size="sm">
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
                          <Input type="text" id="ein"   {...register('ein')} maxWidth="page.single_input" />
                        </FormControl>     
                      </Box>                                                                                                         
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='xs'>Vendor Contact</Heading>
                </CardHeader>

                <CardBody>
                  <Stack maxWidth="page.single_input" spacing="1rem">
                    <HStack>
                        <FormControl isRequired>
                          <FormLabel>Vendor Email</FormLabel>
                          <Input type="email" id="email"   {...register('email')}  />
                        </FormControl>     
                        <FormControl isRequired>
                            <FormLabel>Account Phone</FormLabel>
                            <Input type="tel" id="phone"   {...register('phone')}  onChange={(ev) => handlePhoneInput(ev.target.value, "phone")}/>
                          </FormControl>      
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Heading size='xs'>Vendor Addreses</Heading>
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
                      <HStack spacing="1rem">
                        </HStack>  
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
                      <HStack spacing="1rem">
                          <FormControl isRequired>
                            <FormLabel>City</FormLabel>
                            <Input type="text" id="city"   {...register('city')} />
                          </FormControl>     
                          <FormControl isRequired>
                            <FormLabel>State</FormLabel>
                            <Select id="state" {...register('state')} >
                              <option value="">State</option>
                              {US_STATES?.map((state) => (
                                  <option value={state.id}>{state.name}</option>
                                  ))}
                            </Select>
                          </FormControl>     
                      </HStack>
                      <HStack spacing="1rem">
                          <FormControl isRequired>
                            <FormLabel>ZipCode</FormLabel>
                            <Input type="text" id="zipCode"   {...register('zipCode')} />
                          </FormControl>     
                          <FormControl isRequired>
                            <FormLabel>Country</FormLabel>
                            <Select id="country" {...register('country')} >
                              <option value="USA">USA</option>
                            </Select>
                          </FormControl>     
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader bgColor="table_tile">
                    <Heading size='xs'>Account Contact</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <HStack>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Account Contact Name</FormLabel>
                            <Input type="text" id="accountContactName"   {...register('accountContactName')}  />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Account Contact Email</FormLabel>
                            <Input type="email" id="accountContactEmail"   {...register('accountContactEmail')}  />
                          </FormControl>     
                        </Box>
                        <Box>
                          <FormControl isRequired>
                              <FormLabel>Account ContactPhone</FormLabel>
                              <Input type="tel" id="accountContactPhone"   {...register('accountContactPhone')}  onChange={(ev) => handlePhoneInput(ev.target.value, "accountContactPhone")}/>
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
                      <Button size="xs" bgColor="header_actions" type="submit">
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

export default VendorEdit;
