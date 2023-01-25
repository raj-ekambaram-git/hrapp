import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, projectService, userService } from "../../services";
import {MODE_ADD, PROJECT_VALIDATION_SCHEMA, PROJECT_STATUS, PROJECT_TYPES, INVOICE_CYCLE, INVOICE_PAY_TERMS} from "../../constants/accountConstants";
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
  Textarea,
  InputLeftElement,
  InputGroup,
  useToast,
  Checkbox
} from '@chakra-ui/react';
import {PageMainHeader} from '../../components/common/pageMainHeader';

const ProjectAddEdit = (props) => {
  
  const projectId = props.data.projectId;
  const router = useRouter();
  const toast = useToast();

  const referenceCode = useRef("");
  const description = useRef("");
  const type = useRef("");
  const invoiceCycle = useRef("");
  const addressId = useRef("");
  const status = useRef("");
  const accountId = useRef("");
  const budget = useRef("");
  const miscBudget = useRef("");
  const totalHours = useRef("");
  const averageRate = useRef(0);
  
  const [project, setProject] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [timesheetNotesRequired, setTimesheetNotesRequired] = useState(false);
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
            paymentTerms: projectResponse.paymentTerms,
            timesheetNotesRequired: projectResponse.timesheetNotesRequired,
            budget: projectResponse.budget,
            miscBudget: projectResponse.miscBudget,
            totalHours: projectResponse.totalHours,
            averageRate: projectResponse.averageRate,
            status: projectResponse.status
        };
        refreshAddressForVendor(projectResponse.vendorId);
        setProject(projetData);
        setTimesheetNotesRequired(projectResponse.timesheetNotesRequired)
        
        const fields = ['name','referenceCode', "description", "type", "invoiceCycle","contactName","contactEmail","contactPhone","addressId","vendorId", "accountId","miscBudget","budget","totalHours","status", "averageRate",'paymentTerms'];
        fields.forEach(field => setValue(field, projetData[field]));
        
    }

  }

  async function refreshAddressForVendor(vendorId) {
    const addressListResponse = await accountService.getAddressByVendor(vendorId, userService.getAccountDetails().accountId);
    setAddressList(addressListResponse);

  } 


  function onSubmit(data) {
    data.timesheetNotesRequired = timesheetNotesRequired; 
    return isAddMode
        ? createProject(data)
        : updateProject(projectId, data);
  }

  // Create Account 
  const createProject = async (formData) => {
    try {
      const data = await projectService.createProject(formData);

        if(data.error) {
          toast({
            title: 'New Project.',
            description: 'Error creating project',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }else {
          toast({
            title: 'New Project.',
            description: 'Successfully created new project.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
        }

      if(props.modalRequest) {
        console.log("isnide")
        props.modalRequest();
        router.push("/account/vendor/projects");
      }else {
        router.push("/account/projects");
      }

      
      
    } catch (error) {
      toast({
        title: 'New Project.',
        description: 'Error creating project',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };



  // update invoice in database
  const updateProject = async (projectId, formData) => {
    try {

      const data = await projectService.updateProject(projectId, formData)
      
      if(data.error) {
        toast({
          title: 'Update Project.',
          description: 'Error updating project',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }else {
        toast({
          title: 'Update Project.',
          description: 'Successfully update new project.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }

      router.push("/account/projects");

    } catch (error) {
      console.log(error)
        toast({
          title: 'Update Project.',
          description: 'Error updating project',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
    }
  };


  return (

    <div>
      {isPageAuthprized ? (
        <div> 

          {isAddMode ? (
              <PageMainHeader heading="New Project"/>
          ) : (
            <PageMainHeader heading="Update Project"/>
          )}              

          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>Project Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack spacing={4}>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Name</FormLabel>
                          <Input type="text" {...register('name')}  id="name"   maxWidth="page.single_input"/>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Project Details</FormLabel>
                            <Textarea type="text" id="description" {...register('description')}   maxWidth="page.single_input"/>
                        </FormControl>    
                      </Box>  
                      <Box>
                        <FormControl isRequired>
                            <FormLabel>Project Reference</FormLabel>
                            <Input type="text" id="referenceCode" {...register('referenceCode')}   maxWidth="page.single_input"/>
                        </FormControl>    
                      </Box>                        
                      <HStack spacing="10rem">
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
                      </HStack>
                      <HStack spacing="7rem">
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
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Projet Payment Terms</FormLabel>
                            <Select width="100%" id="paymentTerms" {...register('paymentTerms')} >
                              {INVOICE_PAY_TERMS?.map((paymentTerm) => (
                                      <option value={paymentTerm.paymentTermId}>{paymentTerm.paymentTermName}</option>
                                ))}                                
                            </Select>
                          </FormControl>     
                        </Box>                                                 
                        <Box>
                          <FormControl>
                            <FormLabel>Timesheet Notes Required?</FormLabel>
                            <Checkbox
                              isChecked={timesheetNotesRequired}
                              onChange={(e) => setTimesheetNotesRequired(e.target.checked)}
                            />                              
                          </FormControl>     
                        </Box>  
                      </HStack>                          
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader>
                  <Heading size='xs'>Projet Account/Vendor</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacting="10rem">
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
                              <Select width="40%" id="addressId" {...register('addressId')}>
                                {addressList?.map((address) => (
                                    <option value={address.id}>{address.addressName},{address.address1},{address.city}</option>
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
                          <Input type="text" {...register('contactName')}  id="contactName"   />                    
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Contact Email</FormLabel>
                          <Input type="text" {...register('contactEmail')}  id="contactEmail"   />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Project Contact Phone</FormLabel>
                          <Input type="text" {...register('contactPhone')}  id="contactPhone"   />
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
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />   
                            <Input type="text" {...register('budget')}  id="budget"   />                    
                          </InputGroup>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Misc Budget</FormLabel>
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />   
                            <Input type="text" {...register('miscBudget')}  id="miscBudget"   />                    
                          </InputGroup>
                        </FormControl>     
                      </Box>                      
                      <Box>
                        <FormControl>
                          <FormLabel>Project Total Hours</FormLabel>
                          <Input type="text" {...register('totalHours')}  id="totalHours"   />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Project Average Rate</FormLabel>
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />  
                            <Input type="text" {...register('averageRate')}  id="averageRate"   />
                          </InputGroup>
                        </FormControl>     
                      </Box>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              <Flex marginBottom={4}>
                <HStack>
                  <Box>
                  <Button size="xs" bgColor="header_actions" onClick={() => props.data.onClose()}>
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button size="xs" bgColor="header_actions" type="submit" disabled={formState.isSubmitting} >
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
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
          <PageNotAuthorized/>            
        </>
      )}
    </div>

  );
};

export default ProjectAddEdit;
