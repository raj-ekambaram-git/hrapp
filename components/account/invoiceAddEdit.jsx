import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountService, invoiceService, userService } from "../../services";
import {MODE_ADD, INVOICE_VALIDATION_SCHEMA, INVOICE_STATUS,INVOICE_PAY_TERMS, EMPTY_STRING} from "../../constants/accountConstants";

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
  InputGroup,
  InputLeftElement,
  Text
} from '@chakra-ui/react'
import InvoiceItems from "../invoice/invoiceItems";
import { useDispatch,useSelector } from "react-redux";
import { resetInvoiceItemList, setInvoiceItemList, setProjectResources, resetProjectResources, setInvoiceTotal, setInvoicePaidAmount } from "../../store/modules/Invoice/actions";
import DatePicker from "../common/datePicker";
import { InvoiceConstants } from "../../constants/invoiceConstants";



const InvoiceAddEdit = (props) => {
  
  
  const invoiceId = props.data.invoiceId;
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  
  const [invoiceDate, setInvoiceDate] = useState();
  const [dueDte, setDueDte] = useState();
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectType, setProjectType] = useState(EMPTY_STRING);
  const [invoiceType, setInvoiceType] = useState(EMPTY_STRING);
  const [projectId, setProjectId] = useState(EMPTY_STRING);
  const [vendorName, setVendorName] = useState(EMPTY_STRING);
  const [projectName, setProjectName] = useState(EMPTY_STRING);
  const [status, setStatus] = useState(EMPTY_STRING);
  const [enableInvoiceItemAdd, setEnableInvoiceItemAdd] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);

  
  //Get the invoiceItemsList if there are any
  const invoiceItemList = useSelector(state => state.invoice.invoiceItemList);
  const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
  const invoicePaidAmount = useSelector(state => state.invoice.invoicePaidAmount);
  

  //User Validation START
  const formOptions = { resolver: yupResolver(INVOICE_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;


  
  //Get Account Details only if its EditMode
  useEffect(() => {
    //Reset the invoiceItem List
    dispatch(resetInvoiceItemList());
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }else {
      // setValue("vendorId", incomingVendorId);
    }

    if(userService.isSuperAdmin() || userService.isAccountAdmin() || userService.isAccountVendorRep()) {
      setPageAuthorized(true);
    }

    // ONly for Super Admins
    if(userService.isSuperAdmin()) {
      getAccountsList();
    }
    //Get the vndor list for creating invoices
    if(userService.isAccountAdmin() || userService.isAccountVendorRep()) {
      //This gets called only when account user is logged and create
      getVendorList(userService.getAccountDetails().accountId);
    }
    
    getInvoiceDetailsAPI();
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
      setAccountsList(accountListResponse);

  }


  async function getInvoiceDetailsAPI() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isSuperAdmin() || userService.isAccountAdmin() || userService.isAccountVendorRep()) 
          && (props && props.data && props.data.mode != MODE_ADD)) {
        
        const invoiceResponse = await accountService.getInvoiceDetail(props.data.invoiceId, userService.getAccountDetails().accountId);

        console.log("invoiceResponse:::"+JSON.stringify(invoiceResponse));

        // const invoiceData =  {
        //     id: invoiceResponse.id.toString(),
        //     description: invoiceResponse.description,
        //     type: invoiceResponse.type,
        //     vendorId: invoiceResponse.vendorId,
        //     accountId: invoiceResponse.accountId,
        //     projectId: invoiceResponse.projectId,            
        //     invoiceDate: invoiceResponse.invoiceDate,
        //     invoiceItemList: invoiceResponse.invoiceItemList,
        //     dueDte: invoiceResponse.dueDte,
        //     total: invoiceResponse.total,
        //     paidAmount: invoiceResponse.paidAmount,
        //     status: invoiceResponse.status,
        //     paymentTerms: invoiceResponse.paymentTerms
        // };
        setStatus(invoiceResponse.status);
        setInvoiceType(invoiceResponse.type);
        setProjectId(invoiceResponse.projectId);
        setProjectType(invoiceResponse.project?.type);
        setVendorName(invoiceResponse.vendor?.name);
        setProjectName(invoiceResponse.project?.name);


        if(invoiceResponse.invoiceItems != undefined && invoiceResponse.invoiceItems.length >0){
          setEnableInvoiceItemAdd(true);
        }

        console.log("invoiceResponse.invoiceItemList::::"+JSON.stringify(invoiceResponse.invoiceItems))
        dispatch(setInvoiceItemList(invoiceResponse.invoiceItems));
        dispatch(setInvoiceTotal(invoiceResponse.total));
        dispatch(setInvoicePaidAmount(invoiceResponse.paidAmount));
        
        const fields = ['description', "type", "vendorId","accountId","projectId","invoiceDate","dueDte", "total","status","paymentTerms"];
        fields.forEach(field => setValue(field, invoiceResponse[field]));
    }

  }

  async function refreshProjectForVendor(vendorId) {
    
    setEnableInvoiceItemAdd(false);
    dispatch(resetInvoiceItemList());
    //Call Address table to get all the addresses by vendor
    
    const projectListResponse = await accountService.getProjectsByVendor(vendorId, userService.getAccountDetails().accountId);

    console.log("projectListResponse::"+JSON.stringify(projectListResponse))
    
    setProjectList(projectListResponse);
    setProjectId(EMPTY_STRING);

  } 

  function handleInvoiceType(invoiceTypeValue) {
    console.log("handleInvoiceType:::"+invoiceTypeValue);
    setInvoiceType(invoiceTypeValue)
  }


  async function handleProjectSelection(e) {
    
    if(projectId === "" || projectId === undefined) {
      setEnableInvoiceItemAdd(false);
      dispatch(resetProjectResources())
      setProjectType("");
  
    }
    setProjectId(e.target.value);
    dispatch(resetInvoiceItemList());
    setEnableInvoiceItemAdd(true);
    dispatch(setProjectResources(JSON.parse(e.target.options.item(e.target.selectedIndex).getAttribute("data-projectResources"))))
    setProjectType(e.target.options.item(e.target.selectedIndex).getAttribute("data-projectType"));
    return;
  } 
    

  function onSubmit(data) {
    console.log("DDAAA::"+JSON.stringify(data))

    console.log("invoice Item List :::"+JSON.stringify(invoiceItemList));

    return isAddMode
        ? createInvoice(data)
        : updateInvoice(invoiceId, data);
  }

  // Create Account 
  const createInvoice = async (formData) => {
    try {
        const responseData = await invoiceService.createNewInvoice(formData, invoiceItemList, invoiceDate, dueDte);
        if(!responseData.error) {
          toast({
            title: 'New Invoice.',
            description: 'SSSSS Successfully added new invoice.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          router.push("/account/vendor/"+responseData.vendorId+"/invoices");
        }else {
          toast({
            title: 'Invoice Error.',
            description: 'DDDD Not able to create invoice, plrease try again or contact administrator.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
        }
    } catch (error) {
      console.log("ERRRROORRRR:"+error)
      toast({
        title: 'Invoice Error.',
        description: 'Not able to create invoice, plrease try again or contact administrator. Details:'+error,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };



  // update invoice in database
  const updateInvoice = async (invoiceId, formData) => {
    try {

      const responseData = await invoiceService.updateInvoice(formData, invoiceId, invoiceDate, dueDte,invoiceItemList, invoiceTotal);

      if(!responseData.error) {
        toast({
          title: 'Update Invoice.',
          description: 'Successfully updated invoice.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        router.push("/account/vendor/"+responseData.vendorId+"/invoices");
      }else {
        toast({
          title: 'Invoice Error.',
          description: responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }

    } catch (error) {
      console.log(error)
      toast({
        title: 'Invoice Error.',
        description: 'Not able to update invoice, plrease try again or contact administrator.',
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
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="heading"
            color="white"
            marginBottom="2rem"
            width="60%"
          >
            <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
              {isAddMode ? (
                  <div>New {isVendor? "Vendor": "Account"} Invoice</div>
              ) : (
                <div>Update {isVendor? "Vendor": "Account"} Invoice</div>
              )}              
            </Heading>
          </Flex>
          <Box width="60%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Invoice Details {invoiceId ? (<> for {invoiceId}</>) : (<></>)} </Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Reference/Details</FormLabel>
                          <Input type="text" {...register('description')}  id="description"  size="md" />
                        </FormControl>     
                      </Box>
                      <HStack spacing={8}>
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Invoice Type</FormLabel>
                            <Select width="100%" id="type" {...register('type')} onChange={(ev) => handleInvoiceType(ev.target.value)}>
                            <option value="">Select Invoice Type</option>
                            {InvoiceConstants.INVOICE_TYPES?.map((invoiceType) => (
                                    <option value={invoiceType.invoiceTypeId}>{invoiceType.invoiceTypeName}</option>
                              ))}                                  
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Payment Terms</FormLabel>
                            <Select width="100%" id="paymentTerms" {...register('paymentTerms')} >
                              {INVOICE_PAY_TERMS?.map((paymentTerm) => (
                                    <option value={paymentTerm.paymentTermId}>{paymentTerm.paymentTermName}</option>
                              ))}                                
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Invoice Status</FormLabel>
                            <Select width="100%" id="status" {...register('status')} >
                                {INVOICE_STATUS?.map((invoiceStatus) => (
                                        <option value={invoiceStatus.invoiceStatusId}>{invoiceStatus.invoiceStatusName}</option>
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
                  <Heading size='sm'>User Account/Vendor Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacing="2rem">
                      {isPageSectionAuthorized ? (
                        <>                      
                          <Box>
                            <FormControl isRequired>
                              <FormLabel>Account</FormLabel>
                              <Select width="100%" id="accountId" {...register('accountId')} >
                                  <option value="">Select an Account</option>
                                  {accountsList?.map((account) => (
                                    <option value={account.id}>{account.name}</option>
                                  ))}
                            </Select>
                            </FormControl>     
                          </Box>
                        </>
                      ) : (<></>)}     
                      {(userService.isAccountAdmin() || userService.isAccountVendorRep()) ? (
                        <>
                          <Box>
                            <FormControl isRequired>
                              <FormLabel>Vendor</FormLabel>
                              {isAddMode ? (
                                <Select width="100%" id="vendorId" {...register('vendorId')} onChange={(ev) => refreshProjectForVendor(ev.target.value)}>
                                    <option value="">Select an Vendor</option>
                                    {vendorList?.map((vendor) => (
                                      <option value={vendor.id}>{vendor.name}</option>
                                    ))}
                              </Select>
                              ) : (<>
                              <Text>
                                {vendorName}
                              </Text>
                              </>)}
                            </FormControl>     
                          </Box>
                        </>
                      ) : ("")}
                        <Box>
                            <FormControl isRequired>
                              <FormLabel>Project</FormLabel>
                              {isAddMode ? (
                                <Select width="100%" id="projectId" {...register('projectId')} onChange={(ev) => handleProjectSelection(ev)}>
                                  <option value="" data-projectType="" data-projectResources="">Select Project</option>
                                  {projectList?.map((project) => (
                                      <option value={project.id}  data-projectType={project.type} data-projectResources={JSON.stringify(project.projectResource)}>{project.name}</option>
                                  ))}
                                </Select>
                              ) : (<>
                              <Text>
                                {projectName}
                              </Text>
                                
                              </>)}
                            </FormControl>     
                        </Box>                          
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Invoice Payment Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Date</FormLabel>
                          <DatePicker id="invoiceDate" invoiceDate={invoiceDate} onChange={setInvoiceDate}/>
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Due Date</FormLabel>
                          <DatePicker id="dueDte" dueDte={dueDte} onChange={setDueDte}/>
                        </FormControl>     
                      </Box>  
                    </HStack>                                        
                    <HStack>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Total</FormLabel>
                          <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                                color='dollor_input'
                                fontSize='dollar_left_element'
                                children='$'
                            />      
                            <Input type="text" id="total"  value={invoiceTotal} size="md" {...register('total')} />
                          </InputGroup>    
                          
                        </FormControl>     
                      </Box>
                      {(!isAddMode && (status !== InvoiceConstants.INVOICE_STATUS.Draft && status !== EMPTY_STRING)) ? (
                        <>
                        <Box>
                          <FormControl>
                              <FormLabel>Amount Paid</FormLabel>
                              <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    color='dollor_input'
                                    fontSize='dollar_left_element'
                                    children='$'
                                />      
                                <Input type="text" value={invoicePaidAmount} isReadOnly/>
                              </InputGroup>                             
                          </FormControl>    
                        </Box>   
                        <Box>
                          Invoice Transactions    
                        </Box>   
                        </>
                      ) : (
                        <></>
                      )}
                                                                    
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
              {enableInvoiceItemAdd ? (
                <Card>
                  <CardHeader bgColor="table_tile">
                    <Heading size='sm'>Invoice Items</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                          <InvoiceItems data={{projectId: projectId, projectType: projectType, invoiceType: invoiceType}}></InvoiceItems>
                      </Box>                     
                    </Stack>
                  </CardBody>
                </Card>               
              ) : (
                <></>
                )}
              <Flex marginBottom={4}>
                <HStack>
                  <Box>
                  <Button className="btn" onClick={() => router.push("/accounts")}>
                      Discard
                    </Button>
                  </Box>
                  <Box>
                    <Button type="submit">
                      {isAddMode ? (
                          <div>Add New Invoice</div>
                      ) : (
                        <div>Update Invoice</div>
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

export default InvoiceAddEdit;
