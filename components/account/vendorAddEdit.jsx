import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService, vendorService } from "../../services";
import {MODE_ADD, VENDOR_VALIDATION_SCHEMA, USER_ROLES, AccountConstants} from "../../constants/accountConstants";
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
  useToast,
  Checkbox
} from '@chakra-ui/react';
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedAccountId } from "../../store/modules/Account/actions";
import { ConfigConstants } from "../../constants";
import AddEditWorkFlow from "../workFlow/addEditWorkFlow";
import { VendorStatus } from "@prisma/client";
import { BreadcrumbSection } from "../common/breadcrumbSection";


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
  const vendorContactName = useRef("");
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
  const [enableWorkFlow, setEnableWorkFlow] = useState(false);
  const [workFlow, setWorkFlow] = useState();
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
    if(accountId) {
      setValue("accountId",accountId);
    } else {
      setValue("accountId",userService.getAccountDetails().accountId);
    }
    

    if(userService.isAccountAdmin() || userService.isSuperAdmin()) {
      setPageAuthorized(true);
      // setEnableWorkFlow(userService.accountFeatureEnabled(ConfigConstants.FEATURES.WORK_FLOW))
    }

    getVendorDetailsAPICall();
    

  }, []);


  async function getVendorDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      let accountIdVal = accountId;
      if(!accountId) {
        accountIdVal = userService.getAccountDetails().accountId
      }
      const vendorResponse = await accountService.getVendorDetail(props.data.vendorId, accountIdVal);
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
            vendorContactName: vendorResponse.vendorContactName,
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
            country: vendorResponse.address[0].country,
            workFlowEnabled: vendorResponse.workFlowEnabled
        };

        setVendor(vendorData);
        setEnableWorkFlow(vendorResponse.workFlowEnabled)

        // get user and set form fields
        const fields = ['name', "description", "email", "type","phone","accountId", "ein","status","accountContactName","accountContactEmail","vendorContactName","accountContactPhone","addressName","address1", "address2", "address3","city","state","zipCode","workFlowEnabled"];
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
        if(enableWorkFlow) {
          //Check of name, status and steps are there
          if(workFlow && workFlow.name && workFlow.status && workFlow.steps) {
            formData.workFlowEnabled = true;
          } else {
            toast({
              title: 'Add Client Error.',
              description: 'Workflow Enabled, please make sure you configure workflow for this client.',
              status: 'error',
              position: 'top',
              duration: 9000,
              isClosable: true,
            }) 
            return;  
          }
        }
        const responseData = await vendorService.createVendor(formData, workFlow);
        if(responseData.error) {
          toast({
            title: 'Add Client Error.',
            description: 'Error creating a new client. Details:'+responseData.errorMessage,
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          })    
          return;
        }else {
          toast({
            title: 'Add new client',
            description: 'Successfullt added new client.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })    
          router.push("/account/vendors");
        }
    } catch (error) {
      toast({
        title: 'Add Client Error.',
        description: 'Please add all the required fields to add a client. Details:'+error,
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })    
      return;
    }
  };



  // update invoice in database
  const updateVendor = async (vendorId, formData) => {
    try {
      const responseData = await vendorService.updateVendor(formData, vendorId, vendor.addressId)
      if(responseData.error) {
        toast({
          title: 'Update Client Error.',
          description: 'Error updating the client.',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })    
        return;
      } else {
        toast({
          title: 'Client Updated.',
          description: 'Successfully updated the client.',
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
        title: 'Update Client Error.',
        description: 'Error updating the client.',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })    
    }
  };
  const handleEnableWorkFlow = (enableWF) => {
    setEnableWorkFlow(enableWF)
    if(enableWF) {
      setValue("status", VendorStatus.Inactive)
    }
  }
  return (
    <div>
      {isPageAuthprized ? (
        <div> 
          
          {isAddMode ? (
              <PageMainHeader heading="New Client"/>
          ) : (
              <PageMainHeader heading="Update Client"/>
          )}     
          <BreadcrumbSection breadCrumbData={AccountConstants.BREADCRUMB_DATA_ADD_EDIT_VENDOR} currentPage={isAddMode?"Add Client":vendor.name}/>
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'> Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack spacing={7}>
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('name')}  id="name"  maxWidth="page.single_input"/>
                          <FormLabel> Name</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="description" {...register('description')}  maxWidth="page.single_input"/>
                            <FormLabel> Description</FormLabel>
                        </FormControl>    
                      </Box>  
                      <HStack spacing={6}>
                      {(userService.accountFeatureEnabled(ConfigConstants.FEATURES.WORK_FLOW))?<>
                            {(isAddMode && userService.isWorkFlowAdmin())?<>
                              <Box>
                                <Stack spacing="0.2">
                                  <FormLabel> Enable Workflow?</FormLabel>
                                  <Checkbox onChange={(e) => handleEnableWorkFlow(e.target.checked)}/>
                                </Stack>                                  
                              </Box>                              
                            </>:<></>}
                            {enableWorkFlow?<>
                              <Box>
                                <FormControl isRequired>                                  
                                    <AddEditWorkFlow isAddMode={isAddMode} workFlow={workFlow} setWorkFlow={setWorkFlow} type="Vendor" typeId={vendorId}/>                                                           
                                </FormControl>    
                              </Box>                              
                            </>:<></>}
                        </>:<></>}                        
                        <Box>
                          <FormControl isRequired>
                            <Select width="100%" id="status" {...register('status')} size="sm">
                              {(enableWorkFlow)?<>
                                <option value="Inactive" selected={vendor.status === VendorStatus.Active}>Inactive</option>
                                {(vendor.status !== VendorStatus.Inactive && vendor.status)?<>
                                  <option value="Active" selected={vendor.status === VendorStatus.Active} >Active</option>
                                  <option value="Approved" selected={vendor.status === VendorStatus.Approved}>Approved</option>
                                  <option value="Inactive" selected={vendor.status === VendorStatus.Inactive}>Inactive</option>
                                  <option value="Rejected" selected={vendor.status === VendorStatus.Rejected}>Rejected</option>                                  
                                </>:<></>}
                              </>:<>
                                <option value="Active">Active</option>
                                <option value="Approved">Approved</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Error">Error</option>                              
                                <option value="Rejected">Rejected</option>
                              </>}
                            </Select>
                            <FormLabel> Status</FormLabel>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <Select width="100%" id="type" {...register('type')}  size="sm">
                              <option value="Staffing">Staffing</option>
                              <option value="Product">Product</option>
                              <option value="Project">Project</option>
                              <option value="Supplier">Supplier</option>
                            </Select>
                            <FormLabel> Type</FormLabel>
                          </FormControl>    
                          </Box>                                                  
                      </HStack>                          
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" "type="text" id="ein"   {...register('ein')} maxWidth="page.single_input" />
                          <FormLabel>Account EIN</FormLabel>
                        </FormControl>     
                      </Box>                                                                                                         
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='xs'> Contact</Heading>
                </CardHeader>

                <CardBody>
                  <Stack spacing={7}>
                    <HStack spacing={8}>
                        <FormControl isRequired>                          
                          <Input placeholder=" " type="vendorContactName" id="vendorContactName"   {...register('vendorContactName')}  />
                          <FormLabel> Contact Name (First Last)</FormLabel>
                        </FormControl>   
                        <FormControl isRequired>
                          <Input placeholder=" " type="email" id="email"   {...register('email')}  />
                          <FormLabel> Email</FormLabel>                          
                        </FormControl>     
                        <FormControl isRequired>
                            <Input placeholder=" " type="tel" width="50%" id="phone"   {...register('phone')}  onChange={(ev) => handlePhoneInput(ev.target.value, "phone")}/>
                            <FormLabel>Account Phone</FormLabel>
                          </FormControl>      
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Heading size='xs'> Addreses</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack maxWidth="page.single_input" spacing={7}>
                      <FormControl isRequired>
                        <Input placeholder=" " type="text" id="addressName"   {...register('addressName')} />
                        <FormLabel>Address Name</FormLabel>
                      </FormControl>                          
                      <FormControl isRequired>
                        <Input placeholder=" " type="text" id="address1"   {...register('address1')} />
                        <FormLabel>Address1</FormLabel>                        
                      </FormControl>   
                      <HStack>
                        <FormControl>
                          <Input placeholder=" " type="text" id="address2"   {...register('address2')} />
                          <FormLabel>Address2</FormLabel>                            
                        </FormControl>     
                        <FormControl>
                          <Input placeholder=" " type="text" id="address3"   {...register('address3')} />
                          <FormLabel>Address3</FormLabel>                            
                        </FormControl>     
                      </HStack>
                      <HStack spacing="1rem">
                          <FormControl isRequired>
                            <Input placeholder=" " type="text" id="city"   {...register('city')} />
                            <FormLabel>City</FormLabel>
                          </FormControl>     
                          <FormControl isRequired>
                            <Select id="state" {...register('state')} >
                              <option value="">State</option>
                              {US_STATES?.map((state) => (
                                  <option value={state.id}>{state.name}</option>
                                  ))}
                            </Select>
                            <FormLabel>State</FormLabel>
                          </FormControl>     
                      </HStack>
                      <HStack spacing="1rem">
                          <FormControl isRequired>
                            <Input placeholder=" " type="text" id="zipCode"   {...register('zipCode')} />
                            <FormLabel>ZipCode</FormLabel>
                          </FormControl>     
                          <FormControl isRequired>
                            <Select id="country" {...register('country')} >
                              <option value="USA">USA</option>
                            </Select>
                            <FormLabel>Country</FormLabel>                            
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
                      <Stack spacing={7}>
                        <HStack spacing={8}>
                            <FormControl isRequired>                          
                              <Input placeholder=" " type="text" id="accountContactName"   {...register('accountContactName')}  />
                              <FormLabel>Account Contact Name</FormLabel>                            
                            </FormControl>   
                            <FormControl isRequired>
                              <Input placeholder=" " type="email" id="accountContactEmail"   {...register('accountContactEmail')}  />
                              <FormLabel>Account Contact Email</FormLabel>
                            </FormControl>     
                            <FormControl isRequired>
                              <Input placeholder=" " type="tel" id="accountContactPhone"   {...register('accountContactPhone')}  onChange={(ev) => handlePhoneInput(ev.target.value, "accountContactPhone")}/>
                              <FormLabel>Account ContactPhone</FormLabel>
                            </FormControl>      
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
