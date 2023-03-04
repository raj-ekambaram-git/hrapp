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
import { ConfigConstants, ProjectConstants } from "../../constants";
import AddEditWorkFlow from "../workFlow/addEditWorkFlow";
import { ProjectStatus, VendorType } from "@prisma/client";
import { BreadcrumbSection } from "../common/breadcrumbSection";

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
  const [enableWorkFlow, setEnableWorkFlow] = useState(false);
  const [workFlow, setWorkFlow] = useState();

  

  //User Validation START
  const formOptions = { resolver: yupResolver(PROJECT_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;


  const handlePhoneInput = (e) => {
    // this is where we'll call the phoneNumberFormatter function
    const formattedPhoneNumber = util.formatPhoneNumber(e);
    // we'll set the input value using our setInputValue
    setValue("contactPhone", formattedPhoneNumber);
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
            status: projectResponse.status,
            workFlowEnabled: projectResponse.workFlowEnabled
        };
        refreshAddressForVendor(projectResponse.vendorId);
        setProject(projetData);
        setTimesheetNotesRequired(projectResponse.timesheetNotesRequired)
        setEnableWorkFlow(projectResponse.workFlowEnabled)

        const fields = ['name','referenceCode', "description", "type", "invoiceCycle","contactName","contactEmail","contactPhone","addressId","vendorId", "accountId","miscBudget","budget","totalHours","status", "averageRate",'paymentTerms','workFlowEnabled'];
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
      if(enableWorkFlow) {
        //Check of name, status and steps are there
        if(workFlow && workFlow.name && workFlow.status && workFlow.steps) {
          formData.workFlowEnabled = true;
        } else {
          toast({
            title: 'Add Project Error.',
            description: 'Workflow Enabled, please make sure you configure workflow for this vendor.',
            status: 'error',
            position: 'top',
            duration: 9000,
            isClosable: true,
          }) 
          return;  
        }
      }

      const data = await projectService.createProject(formData, workFlow);

        if(data.error) {
          toast({
            title: 'New Project.',
            description: 'Error creating project',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
          return;
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
      return;
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

  const handleEnableWorkFlow = (enableWF) => {
    setEnableWorkFlow(enableWF)
    if(enableWF) {
      setValue("status", ProjectStatus.Inactive)
    }
  }

  return (

    <div>
      {isPageAuthprized ? (
        <div> 

          {isAddMode ? (
              <PageMainHeader heading="New Project"/>
          ) : (
            <PageMainHeader heading="Update Project"/>
          )}              
          <BreadcrumbSection breadCrumbData={ProjectConstants.BREADCRUMB_DATA_ADD_EDIT} currentPage={isAddMode?"Add Project":project.name}/>
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>Project Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack spacing={7}>
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('name')}  id="name"   maxWidth="page.single_input"/>
                          <FormLabel>Project Name</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>                            
                            <Textarea type="text" id="description" {...register('description')}   maxWidth="page.single_input"/>
                            <FormLabel>Project Details</FormLabel>
                        </FormControl>    
                      </Box>  
                      <Box>
                        <FormControl isRequired>                            
                            <Input  placeholder=" " type="text" id="referenceCode" {...register('referenceCode')}   maxWidth="page.single_input"/>
                            <FormLabel>Project Reference</FormLabel>
                        </FormControl>    
                      </Box>   
                      {(userService.accountFeatureEnabled(ConfigConstants.FEATURES.WORK_FLOW))?<>
                        <HStack spacing="12rem">
                            {(isAddMode && userService.isWorkFlowAdmin())?<>                              
                              <Box>
                                <Stack spacing="0.2">
                                  <FormLabel>Enable WorkFlow?</FormLabel>
                                  <Checkbox
                                      onChange={(e) => handleEnableWorkFlow(e.target.checked)}
                                    />  
                                </Stack>    
                              </Box>                              
                            </>:<></>}
                            {enableWorkFlow?<>
                              <Box>
                                <FormControl isRequired>
                                    <AddEditWorkFlow isAddMode={isAddMode} workFlow={workFlow} setWorkFlow={setWorkFlow} type="Project" typeId={projectId}/>                       
                                </FormControl>    
                              </Box>                              
                            </>:<></>}
                          </HStack>
                      </>:<></>}                                           
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                            <Select width="160px" id="status" {...register('status')} >                          
                              {(enableWorkFlow)?<>
                                  <option value="Created">Created</option>
                                  {(project.status !== ProjectStatus.Created && project.status)?<>
                                    <option value="Open" selected={project.status === ProjectStatus.Open} >Open</option>
                                    <option value="Closed" selected={project.status === ProjectStatus.Closed}>Closed</option>
                                    <option value="Settled" selected={project.status === ProjectStatus.Settled}>Settled</option>
                                  </>:<></>}
                                </>:<>
                                <option value="Created">Created</option>
                                  <option value="Open">Open</option>
                                  <option value="Closed">Closed</option>
                                  <option value="Settled">Settled</option>                              
                                </>}    
                            </Select>              
                            <FormLabel>Projet Status</FormLabel>          
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <Select width="160px" id="type" {...register('type')} >
                                {PROJECT_TYPES?.map((projectType) => (
                                        <option value={projectType.projectTypeId}>{projectType.projectTypeName}</option>
                                ))}   
                            </Select>
                            <FormLabel>Projet Type</FormLabel>
                          </FormControl>     
                        </Box> 
                      </HStack>
                      <HStack spacing="10rem">
                        <Box>
                          <FormControl isRequired>
                            <Select width="160px" id="invoiceCycle" {...register('invoiceCycle')} >
                                {INVOICE_CYCLE?.map((projectInvoiceCycle) => (
                                        <option value={projectInvoiceCycle.cycleId}>{projectInvoiceCycle.cycleName}</option>
                                ))}   
                            </Select>
                            <FormLabel>Projet Invoice Cycle</FormLabel>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>                            
                            <Select width="160px" id="paymentTerms" {...register('paymentTerms')} >
                              {INVOICE_PAY_TERMS?.map((paymentTerm) => (
                                      <option value={paymentTerm.paymentTermId}>{paymentTerm.paymentTermName}</option>
                                ))}                                
                            </Select>
                            <FormLabel>Projet Payment Terms</FormLabel>
                          </FormControl>     
                        </Box>                                                 
                        <Box>
                          <HStack spacing="0.2">
                            <FormLabel>Timesheet Notes Required?</FormLabel>
                            <Checkbox
                              isChecked={timesheetNotesRequired}
                              onChange={(e) => setTimesheetNotesRequired(e.target.checked)}
                            />                              
                          </HStack>     
                        </Box>  
                      </HStack>                          
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader>
                  <Heading size='xs'>Projet Account and Client Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack  spacing={7}>
                    <HStack spacting="10rem">
                      {isPageSectionAuthorized ? (
                        <>                      
                          <Box>
                            <FormControl isRequired>                              
                              <Select width="180px" id="accountId" {...register('accountId')} >
                                  <option value="">Select an Account</option>
                                  {accountList?.map((account) => (
                                    <option value={account.id}>{account.name}</option>
                                  ))}
                            </Select>
                            <FormLabel>Account</FormLabel>
                            </FormControl>     
                          </Box>
                        </>
                      ) : (<></>)}     
                      {userService.isAccountAdmin() ? (
                        <>
                          <Box>
                            <FormControl isRequired>                              
                              <Select width="100%" id="vendorId" {...register('vendorId')} onChange={(ev) => refreshAddressForVendor(ev.target.value)}>
                                  <option value="">Select Client</option>
                                  {vendorList?.map((vendor) => (
                                    vendor.type != VendorType.Supplier?<>
                                      <option value={vendor.id}>{vendor.name}</option>
                                    </>:<></>      
                                  ))}
                            </Select>
                            <FormLabel>Client</FormLabel>
                            </FormControl>     
                          </Box>
                        </>
                      ) : ("")}
                    </HStack>
                    <Box>
                        <FormControl isRequired>                            
                              <Select width="40%" id="addressId" {...register('addressId')}>
                                {addressList?.map((address) => (
                                    <option value={address.id}>{address.addressName},{address.address1},{address.city}</option>
                                ))}
                              </Select>
                              <FormLabel>Project Location</FormLabel>
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
                  <Stack spacing='7'>
                    <HStack spacing="1rem">
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('contactName')}  id="contactName"   />                    
                          <FormLabel>Project Contact Name</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('contactEmail')}  id="contactEmail"   />
                          <FormLabel>Project Contact Email</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>                          
                          <Input  placeholder=" " type="text" {...register('contactPhone')}  id="contactPhone"  onChange={(ev) => handlePhoneInput(ev.target.value)} />
                          <FormLabel>Project Contact Phone</FormLabel>
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
                  <Stack spacing={7}>
                    <HStack spacing="1rem">
                      <Box>
                        <FormControl isRequired>                          
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />   
                            <Input  placeholder=" " type="text" {...register('budget')}  id="budget"   />                    
                            <FormLabel>Project Total Budget</FormLabel>
                          </InputGroup>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>                          
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />   
                            <Input  placeholder=" " type="text" {...register('miscBudget')}  id="miscBudget"   />                    
                            <FormLabel>Project Misc Budget</FormLabel>
                          </InputGroup>
                        </FormControl>     
                      </Box>                      
                      <Box>
                        <FormControl>                          
                          <Input  placeholder=" " type="text" {...register('totalHours')}  id="totalHours"   />
                          <FormLabel>Project Total Hours</FormLabel>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>                          
                          <InputGroup>
                            <InputLeftElement
                                      pointerEvents='none'
                                      color='dollor_input'
                                      fontSize='dollar_left_element'
                                      children='$'
                                  />  
                            <Input placeholder=" " type="text" {...register('averageRate')}  id="averageRate"   />
                            <FormLabel>Project Average Rate</FormLabel>
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
                  <Button size="xs" colorScheme="yellow"  onClick={() => router.back()}>
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
