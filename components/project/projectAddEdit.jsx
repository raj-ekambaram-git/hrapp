import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService, addressService } from "../../services";
import {MODE_ADD, PROJECT_VALIDATION_SCHEMA, PROJECT_STATUS, PROJECT_TYPES, INVOICE_CYCLE} from "../../constants/accountConstants";
import Link from "next/link";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea
} from '@chakra-ui/react'

const ProjectAddEdit = (props) => {
  
  const projectId = props.data.projectId;
  const router = useRouter();

  const referenceCode = useRef("");
  const description = useRef("");
  const type = useRef("");
  const invoiceCycle = useRef("");
  const addressId = useRef("");
  const status = useRef("");
  const accountId = useRef("");
  const budget = useRef("");
  const totalHours = useRef("");
  const averageRate = useRef("");
  
  const [project, setProject] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [vendorList, setVendorList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  

  //User Validation START
  const formOptions = { resolver: yupResolver(PROJECT_VALIDATION_SCHEMA) };

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


  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    if(userService.isSuperAdmin() || userService.isAccountAdmin()) {
      setPageAuthorized(true);
    }

    if(userService.isSuperAdmin()) {
      setPageSectionAuthorized(true);
      getAccountsList();
    }
    if(userService.isAccountAdmin()) {
      //This gets called only when account user is logged and create
      getVendorList(userService.getAccountDetails().accountId);
      
    }
    
    getProjectDetailsAPICall();
  }, []);

  async function getVendorList(accountId) {
    // setPageAuthorized(true);
    const vendorListResponse = await accountService.getVendorList(accountId);
    setVendorList(vendorListResponse);
    setValue("accountId",userService.getAccountDetails().accountId);

}  
  
  /**
   * Function to get the list of accounts for a drop down
   */
  async function getAccountsList() {
      // setPageAuthorized(true);
      setVendor(false);
      const accountListResponse = await userService.getAccountsList();
      setAccountList(accountListResponse);

  }


  async function getProjectDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isSuperAdmin() || userService.isAccountAdmin()) && (props && props.data && props.data.mode != MODE_ADD)) {
      const projectResponse = await accountService.getProjectDetail(props.data.projectId,userService.getAccountDetails().accountId);
        const projetData =  {
            id: projectResponse.id.toString(),
            name: projectResponse.name,
            referenceCode: projectResponse.referenceCode,
            description: projectResponse.description,
            type: projectResponse.type,
            invoiceCycle: projectResponse.invoiceCycle,
            addressId: projectResponse.addressId,
            vendorId: projectResponse.vendorId,
            accountId: projectResponse.accountId,
            contactName: projectResponse.contactName,
            contactEmail: projectResponse.contactEmail,
            contactPhone: projectResponse.contactPhone,            
            budget: projectResponse.budget,
            totalHours: projectResponse.totalHours,
            averageRate: projectResponse.averageRate,
            status: projectResponse.status
        };

        setProject(projetData);

        // get user and set form fields
            const fields = ['name','referenceCode', "description", "type", "invoiceCycle","contactName","contactEmail","contactPhone","addressId","vendorId", "accountId","budget","totalHours","status", "averageRate"];
            fields.forEach(field => setValue(field, projetData[field]));
    }

  }

  async function refreshAddressForVendor(vendorId) {
    console.log("refreshAddressForVendor::"+JSON.stringify(vendorId))
    //Call Address table to get all the addresses by vendor
    
    const addressListResponse = await accountService.getAddressByVendor(vendorId, userService.getAccountDetails().accountId);
    console.log("addressListResponse::::"+JSON.stringify(addressListResponse));
    
    setAddressList(addressListResponse);

  } 


  function onSubmit(data) {
    console.log("DDAAA::"+JSON.stringify(data))
    return isAddMode
        ? createProject(data)
        : updateProject(projectId, data);
  }

  // Create Account 
  const createProject = async (formData) => {
    try {
        const res = await fetch("/api/account/project/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            referenceCode: formData.referenceCode,
            description: formData.description,
            type: formData.type,
            invoiceCycle: formData.invoiceCycle,
            addressId: parseInt(formData.addressId),
            vendorId: parseInt(formData.vendorId),
            accountId: parseInt(formData.accountId),
            budget: formData.budget,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            totalHours: parseInt(formData.totalHours),
            averageRate: formData.averageRate,            
            status: formData.status

          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        //Close the modal
        //router.push("/account/"+userService.getAccountDetails().accountId+"/users");
        console.log("Prosp:::"+JSON.stringify(props.data))
        console.log("before forwarding..::"+props.data.modalRequest)
      if(props.data.modalRequest) {
        console.log("isnide")
        props.data.onClose();
      }else {
        console.log("NOT INSIDE")
        router.push("/account/vendor/"+formData.vendorId+"/projects");
      }

      
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };



  // update invoice in database
  const updateProject = async (projectId, formData) => {
    try {
      const res = await fetch(`/api/account/project/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(projectId),
          name: formData.name,
          referenceCode: formData.referenceCode,
          description: formData.description,
          type: formData.type,
          invoiceCycle: formData.invoiceCycle,
          addressId: parseInt(formData.addressId),
          vendorId: parseInt(formData.vendorId),
          accountId: parseInt(formData.accountId),
          budget: formData.budget,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          totalHours: parseInt(formData.totalHours),
          averageRate: formData.averageRate,            
          status: formData.status

        }),
      });

      const data = await res.json();

      console.log("Prosp:::"+JSON.stringify(props.data))
      console.log("before forwarding..::"+props.data.modalRequest)

      if(props.data.modalRequest) {
        props.data.onClose();
      }else {
        router.push("/account/vendor/"+formData.vendorId+"/projects");
      }
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
            width="100%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              {isAddMode ? (
                  <div>New Project</div>
              ) : (
                <div>Update Project</div>
              )}              
            </Heading>
          </Flex>
          <Box width="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Project Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Name</FormLabel>
                          <Input type="text" {...register('name')}  id="name"  size="md" />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Project Details</FormLabel>
                            <Textarea type="text" id="description" {...register('description')}  size="md" />
                        </FormControl>    
                      </Box>  
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Project Reference</FormLabel>
                            <Input type="text" id="referenceCode" {...register('referenceCode')}  size="md" />
                        </FormControl>    
                      </Box>                        
                      <HStack spacing={3}>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Projet Status</FormLabel>
                            <Select width="100%" id="status" {...register('status')} >
                                {PROJECT_STATUS?.map((projectStatus) => (
                                        <option value={projectStatus.projectStatusId}>{projectStatus.projectStatusName}</option>
                                ))}   
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Projet Type</FormLabel>
                            <Select width="100%" id="type" {...register('type')} >
                                {PROJECT_TYPES?.map((projectType) => (
                                        <option value={projectType.projectTypeId}>{projectType.projectTypeName}</option>
                                ))}   
                            </Select>
                          </FormControl>     
                        </Box> 
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Projet Invoice Cycle</FormLabel>
                            <Select width="100%" id="invoiceCycle" {...register('invoiceCycle')} >
                                {INVOICE_CYCLE?.map((projectInvoiceCycle) => (
                                        <option value={projectInvoiceCycle.cycleId}>{projectInvoiceCycle.cycleName}</option>
                                ))}   
                            </Select>
                          </FormControl>     
                        </Box>                                                 
                      </HStack>                          
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Projet Account/Vendor</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      {isPageSectionAuthorized ? (
                        <>                      
                          <Box>
                            <FormControl isRequired>
                              <FormLabel>Account</FormLabel>
                              <Select width="100%" id="accountId" {...register('accountId')} >
                                  <option value="">Select an Account</option>
                                  {accountList?.map((account) => (
                                    <option value={account.id}>{account.name}</option>
                                  ))}
                            </Select>
                            </FormControl>     
                          </Box>
                        </>
                      ) : (<></>)}     
                      {userService.isAccountAdmin() ? (
                        <>
                          <Box>
                            <FormControl isRequired>
                              <FormLabel>Vendor</FormLabel>
                              <Select width="100%" id="vendorId" {...register('vendorId')} onChange={(ev) => refreshAddressForVendor(ev.target.value)}>
                                  <option value="">Select an Vendor</option>
                                  {vendorList?.map((vendor) => (
                                    <option value={vendor.id}>{vendor.name}</option>
                                  ))}
                            </Select>
                            </FormControl>     
                          </Box>
                        </>
                      ) : ("")}
                    </HStack>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel>Project Location</FormLabel>
                              <Select width="100%" id="addressId" {...register('addressId')}>
                                {addressList?.map((address) => (
                                    <option value={address.id}>{address.addressName},{address.address1},{address.city},</option>
                                ))}
                              </Select>
                        </FormControl>     
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Project Contact</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacing="1rem">
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Contact Name</FormLabel>
                          <Input type="text" {...register('contactName')}  id="contactName"  size="md" />                    
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Contact Email</FormLabel>
                          <Input type="text" {...register('contactEmail')}  id="contactEmail"  size="md" />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Contact Phone</FormLabel>
                          <Input type="text" {...register('contactPhone')}  id="contactPhone"  size="md" />
                        </FormControl>     
                      </Box>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Project Budget</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacing="1rem">
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Total Budget</FormLabel>
                          <Input type="text" {...register('budget')}  id="budget"  size="md" />                    
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Total Hours</FormLabel>
                          <Input type="text" {...register('totalHours')}  id="totalHours"  size="md" />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Average Rate</FormLabel>
                          <Input type="text" {...register('averageRate')}  id="averageRate"  size="md" />
                        </FormControl>     
                      </Box>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              <Flex marginBottom={4}>
                <HStack>
                  <Box>
                  <Button className="btn" onClick={() => props.data.onClose()}>
                      Close
                    </Button>
                  </Box>
                  <Box>
                    <Button type="submit">
                      {isAddMode ? (
                          <div>Add New Project</div>
                      ) : (
                        <div>Update Project</div>
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

export default ProjectAddEdit;
