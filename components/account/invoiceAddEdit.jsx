import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, INVOICE_VALIDATION_SCHEMA, INVOICE_STATUS,INVOICE_PAY_TERMNS} from "../../constants/accountConstants";

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
} from '@chakra-ui/react'


const InvoiceAddEdit = (props) => {
  
  
  const invoiceId = props.data.invoiceId;
  
  const router = useRouter();
  
  const [invoice, setInvoice] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  //User Validation START
  const formOptions = { resolver: yupResolver(INVOICE_VALIDATION_SCHEMA) };

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
    }else {
      // setValue("vendorId", incomingVendorId);
    }

    if(userService.isSuperAdmin() || userService.isAccountAdmin() || userService.isAccountVendorRep()) {
      setPageAuthorized(true);
    }

    if(userService.isSuperAdmin()) {
      getAccountsList();
    }
    if(userService.isAccountAdmin() || userService.isAccountVendorRep()) {
      //This gets called only when account user is logged and create
      getVendorList(userService.getAccountDetails().accountId);
      // setProjectList(userService.getAccountDetails().accountId);
    }
    
    getInvoiceDetailsAPI();
  }, []);

  async function getVendorList(accountId) {
    // setPageAuthorized(true);
    const vendorListResponse = await accountService.getVendorList(accountId);
    setVendorList(vendorListResponse);
    setValue("accountId",userService.getAccountDetails().accountId);

}  
  
  // async function setProjectList(vendorId) {
  //   // setPageAuthorized(true);
  //   const vendorListResponse = await accountService.getVendorList(accountId);
  //   setVendorList(vendorListResponse);
  // }  
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
        
            console.log("props.data.invoiceId::"+props.data.invoiceId)
        const invoiceResponse = await accountService.getInvoiceDetail(props.data.invoiceId, userService.getAccountDetails().accountId);
          console.log("invoiceResponse::"+JSON.stringify(invoiceResponse))

        const invoiceData =  {
            id: invoiceResponse.id.toString(),
            description: invoiceResponse.description,
            type: invoiceResponse.type,
            vendorId: invoiceResponse.vendorId,
            accountId: invoiceResponse.accountId,
            projectId: invoiceResponse.projectId,            
            invoiceDate: invoiceResponse.invoiceDate,
            dueDte: invoiceResponse.dueDte,
            transactionId: invoiceResponse.transactionId,
            total: invoiceResponse.total,
            paidAmount: invoiceResponse.paidAmount,
            status: invoiceResponse.status,
            notes: invoiceResponse.notes,
            paymentTerms: invoiceResponse.paymentTerms
        };

        setInvoice(invoiceData);

        // get user and set form fields
            const fields = ['description', "type", "vendorId","accountId","projectId", "notes","invoiceDate","dueDte","transactionId", "total", "paidAmount","status","paymentTerms"];
            fields.forEach(field => setValue(field, invoiceResponse[field]));
    }

  }

  function onSubmit(data) {
    console.log("DDAAA::"+JSON.stringify(data))
    return isAddMode
        ? createInvoice(data)
        : updateInvoice(invoiceId, data);
  }

  // Create Account 
  const createInvoice = async (formData) => {
    try {
        const res = await fetch("/api/account/invoice/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: formData.description,
            type: formData.type,
            accountId: parseInt(formData.accountId),
            vendorId: parseInt(formData.vendorId),
            projectId: parseInt(formData.projectId),
            invoiceDate: new Date(),
            dueDte: new Date(),
            transactionId: formData.transactionId,
            total: formData.total,
            notes: formData.notes,
            paidAmount: formData.paidAmount,
            status: formData.status,
            paymentTerms: formData.paymentTerms
          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/vendor/"+vendorId+"/invoices");
        
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };



  // update invoice in database
  const updateInvoice = async (invoiceId, formData) => {
    try {
      const res = await fetch(`/api/account/invoice/${invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(invoiceId),
          description: formData.description,
          type: formData.type,
          accountId: parseInt(formData.accountId),
          vendorId: parseInt(formData.vendorId),
          projectId: parseInt(formData.projectId),
          invoiceDate: new Date(),
          dueDte: formData.dueDte,
          transactionId: formData.transactionId,
          total: formData.total,
          notes: formData.notes,
          paidAmount: formData.paidAmount,
          status: formData.status,
          paymentTerms: formData.paymentTerms  

        }),
      });

      const data = await res.json();
      
      // router.push("/account/vendor"+invoiceId+"/invoices");
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
                  <Heading size='sm'>Invoice Details</Heading>
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
                            <Select width="100%" id="type" {...register('type')} >
                              <option value="Staffing">Staffing</option>
                              <option value="Product">Product</option>
                              <option value="Project">Project</option>
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Payment Terms</FormLabel>
                            <Select width="100%" id="paymentTerms" {...register('paymentTerms')} >
                              {INVOICE_PAY_TERMNS?.map((paymentTerm) => (
                                    <option value={paymentTerm.paymentTermId}>{paymentTerm.paymentTermName}</option>
                              ))}                                
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Projet Status</FormLabel>
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
                              <Select width="100%" id="vendorId" {...register('vendorId')} >
                                  <option value="">Select an Vendor</option>
                                  {vendorList?.map((vendor) => (
                                    <option value={vendor.id}>{vendor.name}</option>
                                  ))}
                            </Select>
                            </FormControl>     
                          </Box>
                        </>
                      ) : ("")}
                        <Box>
                            <FormControl isRequired>
                              <FormLabel>Project</FormLabel>
                              <Select width="100%" id="projectId" {...register('projectId')} >
                                <option value="1">Project</option>
                                <option value="1">Product</option>
                                <option value="1">Project</option>
                              </Select>
                            </FormControl>     
                        </Box>                          
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader bgColor="table_tile">
                  <Heading size='sm'>Invoice Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Date</FormLabel>
                          <Input
                            placeholder="Select Date and Time"
                            type="datetime-local"
                            id="invoiceDate"  size="md" {...register('invoiceDate')} />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl>
                          <FormLabel>Due Date</FormLabel>
                          <Input
                            placeholder="Select Date and Time"
                            type="datetime-local"
                            id="dueDte"  size="md" {...register('dueDte')} />
                        </FormControl>     
                      </Box>  
                    </HStack>                                        
                    <HStack>
                      <Box>
                        <FormControl>
                          <FormLabel>Transaction Data</FormLabel>
                          <Input type="text" id="transactionId"  size="md" {...register('transactionId')} />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Total</FormLabel>
                          <Input type="text" id="total"  size="md" {...register('total')} />
                        </FormControl>     
                      </Box>
                      <Box>
                      <FormControl>
                          <FormLabel>Amount Paid</FormLabel>
                          <Input type="text" id="paidAmount"  size="md" {...register('paidAmount')} />
                      </FormControl>    
                      </Box>                                                                        
                    </HStack>
                    <Box>
                        <FormControl>
                          <FormLabel>Notes</FormLabel>
                          <Textarea type="text" id="notes"  size="md" {...register('notes')} />
                        </FormControl>     
                      </Box>                       
                  </Stack>
                </CardBody>
              </Card>
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
