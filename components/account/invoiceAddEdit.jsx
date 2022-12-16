import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, USER_VALIDATION_SCHEMA, INVOICE_CYCLE,INVOICE_PAY_TERMNS} from "../../constants/accountConstants";

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
  NumberDecrementStepper
} from '@chakra-ui/react'


const InvoiceAddEdit = (props) => {
  
  const incomingVendorId = props.data.vendorId;
  const invoiceId = props.data.invoiceId;
  
  const router = useRouter();
  const type = useRef("");
  const cycle = useRef("");

  const accountId = useRef("");
  const quantity = useRef("");
  const rate = useRef("");
  const dueDte = useRef("");
  const transactionId = useRef("");
  const notes = useRef("");
  const total = useRef("");
  const paidAmount = useRef("");
  const status = useRef("");
  const paymentTerms = useRef("");
  const createdDate = useRef("");
  const lastUpdateDate = useRef("");
  const userId = useRef("");
  const vendorId = useRef("");

  const [invoice, setInvoice] = useState({});
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  const [isVendor, setVendor] = useState(true);
  const [accountsList, setAccountsList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  //User Validation START
  const formOptions = { resolver: yupResolver(USER_VALIDATION_SCHEMA) };

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
        const invoiceData =  {
            id: invoiceResponse.id.toString(),
            description: invoiceResponse.description,
            type: invoiceResponse.type,
            cycle: invoiceResponse.cycle,
            vendorId: invoiceResponse.vendorId,
            accountId: invoiceResponse.accountId,
            quantity: invoiceResponse.quantity,
            rate: invoiceResponse.rate,
            dueDte: invoiceResponse.dueDte,
            transactionId: invoiceResponse.transactionId,
            notes: invoiceResponse.notes,
            total: invoiceResponse.total,
            paidAmount: invoiceResponse.paidAmount,
            status: invoiceResponse.status,
            paymentTerms: invoiceResponse.paymentTerms,
            userId: invoiceResponse.userId
        };

        setInvoice(invoiceData);

        // get user and set form fields
            const fields = ['description', "type", "cycle", "vendorId","accountId","quantity", "rate","dueDte","transactionId","notes", "total", "paidAmount","status","paymentTerms","userId"];
            fields.forEach(field => setValue(field, invoiceData[field]));
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
            cycle: formData.cycle,
            accountId: parseInt(formData.accountId),
            vendorId: parseInt(formData.vendorId),
            quantity: formData.quantity,
            rate: formData.rate,
            dueDte: formData.dueDte,
            transactionId: formData.transactionId,
            notes: formData.notes,
            total: formData.total,
            paidAmount: formData.paidAmount,
            status: formData.status,
            paymentTerms: formData.paymentTerms,
            userId: formData.userId
          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/vendor/"+data.vendorId+"/invoices");
        
      
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
          cycle: formData.cycle,
          accountId: parseInt(formData.accountId),
          vendorId: parseInt(formData.vendorId),
          quantity: formData.quantity,
          rate: formData.rate,
          dueDte: formData.dueDte,
          transactionId: formData.transactionId,
          notes: formData.notes,
          total: formData.total,
          paidAmount: formData.paidAmount,
          status: formData.status,
          paymentTerms: formData.paymentTerms,
          userId: formData.userId          

        }),
      });

      const data = await res.json();
      
      router.push("/account/vendor"+data.vendorId+"/invoices");
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
                            <FormLabel>Invoice Cycle</FormLabel>
                            <Select width="100%" id="cycle" {...register('cycle')} >
                              {INVOICE_CYCLE?.map((invoiceCycle) => (
                                    <option value={invoiceCycle.cycleId}>{invoiceCycle.cycleName}</option>
                              ))}                                
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
                    <HStack>
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
                    <Box>
                      <FormControl>
                        <FormLabel>Quantity</FormLabel>
                        <NumberInput defaultValue={0} precision={2} step={0.2} id="quantity"  size="md" {...register('quantity')} >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>                        
                      </FormControl>     
                      <FormControl>
                        <FormLabel>Rate</FormLabel>
                        <NumberInput defaultValue={0} precision={2} step={0.2} id="rate"  size="md" {...register('rate')} >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>                          
                      </FormControl>                          
                      <FormControl>
                        <FormLabel>Due Date</FormLabel>
                        <Input
                          placeholder="Select Date and Time"
                          size="md"
                          type="datetime-local"
                          />
                      </FormControl>     
                    </Box>
                    <HStack>
                      <Box>
                        <FormControl>
                          <FormLabel>Transaction ID</FormLabel>
                          <Input type="text" id="transactionId"  size="md" {...register('transactionId')} />
                        </FormControl>     
                      </Box>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Total</FormLabel>
                          <NumberInput defaultValue={0} precision={2} step={0.2} id="total"  size="md" {...register('total')} >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>                          
                        </FormControl>     
                      </Box>
                      <Box>
                      <FormControl>
                          <FormLabel>Amount Paid</FormLabel>
                          <NumberInput defaultValue={0} precision={2} step={0.2} id="paidAmount"  size="md" {...register('paidAmount')} >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>                          
                        </FormControl>    
                      </Box>                                                                        
                    </HStack>
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
                          <div>Add New {isVendor? "Vendor": "Account"} Invoice</div>
                      ) : (
                        <div>Update {isVendor? "Vendor": "Account"} Invoice</div>
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
