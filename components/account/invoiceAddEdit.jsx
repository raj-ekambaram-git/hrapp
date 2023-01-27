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
  Text,
  Badge
} from '@chakra-ui/react'
import InvoiceItems from "../invoice/invoiceItems";
import { useDispatch,useSelector } from "react-redux";
import { resetInvoiceItemList, setInvoiceItemList, setProjectResources, resetProjectResources, setInvoiceTotal, setInvoicePaidAmount, setInvoiceEmailTo,
  resetInvoiceEmailTo, removeEmailFromInvoiceEmailListByIndex, setSelectedInvoiceTSEId, setSelectedInvoiceExpId } from "../../store/modules/Invoice/actions";
import DatePicker from "../common/datePicker";
import { InvoiceConstants } from "../../constants/invoiceConstants";
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized';
import {PageMainHeader} from '../../components/common/pageMainHeader';
import InvoiceEmailTo from "../invoice/invoiceEmailTo";
import { DocumentConstants, NotesConstants } from "../../constants";
import { util } from "../../helpers/util";
import { setDocumentType } from "../../store/modules/Document/actions";
import InvoiceDetailActions from "../invoice/invoiceDetailActions";
import { ExpenseStatus, InvoiceType, TimesheetStatus } from "@prisma/client";



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
  const [enableEmailIcon, setEnableEmailIcon] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);

  
  //Get the invoiceItemsList if there are any
  const invoiceItemList = useSelector(state => state.invoice.invoiceItemList);
  const invoiceTotal = useSelector(state => state.invoice.invoiceTotal);
  const invoicePaidAmount = useSelector(state => state.invoice.invoicePaidAmount);
  const invoiceEmailTos = useSelector(state => state.invoice.invoiceEmailTo);
  const selectedVendorId = useSelector(state => state.vendor.selectedVendorId);

  //User Validation START
  const formOptions = { resolver: yupResolver(INVOICE_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;
  
  //To Enable Notes
  const notesData = {
    type: NotesConstants.NOTES_TYPE.Invoice,
    typeId: parseInt(invoiceId),
    typeName: EMPTY_STRING
  }
  
  const documentData = {
    type: DocumentConstants.DOCUMENMT_TYPE.Invoice,
    typeId: parseInt(invoiceId),
    typeName: EMPTY_STRING
  }

  
  //Get Account Details only if its EditMode
  useEffect(() => {
    //Reset the invoiceItem List
    dispatch(resetInvoiceItemList());
    dispatch(resetInvoiceEmailTo());
    dispatch(setDocumentType(documentData));
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
        setStatus(invoiceResponse.status);
        setInvoiceType(invoiceResponse.type);
        setProjectId(invoiceResponse.projectId);
        setProjectType(invoiceResponse.project?.type);
        setVendorName(invoiceResponse.vendor?.name);
        setProjectName(invoiceResponse.project?.name);
        setEnableEmailIcon(true);
        setInvoiceDate(invoiceResponse.invoiceDate)
        setDueDte(invoiceResponse.dueDte)

        if(invoiceResponse.invoiceEmailTo != undefined && invoiceResponse.invoiceEmailTo.length >0){
          dispatch(setInvoiceEmailTo(invoiceResponse.invoiceEmailTo));
        }

        if(invoiceResponse.invoiceItems != undefined && invoiceResponse.invoiceItems.length >0){
          setEnableInvoiceItemAdd(true);
          dispatch(setInvoiceItemList(invoiceResponse.invoiceItems));
        }

        console.log("invoiceResponse.invoiceItemList::::"+JSON.stringify(invoiceResponse.invoiceItems))
        const expenseIds =  [...invoiceResponse.invoiceItems].map((invoice)=> {
          if(invoice.type ==InvoiceType.Expense) {
            return parseInt(invoice?.expense?.id)
          }
        });
        console.log("expenseIds::::"+expenseIds)
        const timesheetEntryIds =  [...invoiceResponse.invoiceItems].map((invoice)=> {
          if(invoice.type ==InvoiceType.Timesheet) {
            return parseInt(invoice.timesheetEntry?.id)
          }
        });

        console.log("timesheetEntryIds::::"+timesheetEntryIds)

        console.log("expenseIds::"+expenseIds+"****TSE::"+timesheetEntryIds)
        // const expenseIds = invoiceResponse.invoiceItems.filter((invoice) => (invoice.type ==InvoiceType.Expense));
        // const timesheetEntryIds = invoiceResponse.invoiceItems.filter((invoice) => (invoice.type ==InvoiceType.timesheetEntry));
        dispatch(setSelectedInvoiceTSEId(timesheetEntryIds));
        // dispatch(setSelectedInvoiceExpId(expenseIds));
        
        dispatch(setInvoiceTotal(invoiceResponse.total));
        dispatch(setInvoicePaidAmount(invoiceResponse.paidAmount));
        
        const fields = ['description', "type", "vendorId","accountId","projectId","invoiceDate","dueDte", "total","status","paymentTerms"];
        fields.forEach(field => setValue(field, invoiceResponse[field]));
    }

  }

  async function refreshProjectForVendor(selectedVendorObj) {
    
    setEnableInvoiceItemAdd(false);
    setValue("total",0)
    dispatch(setInvoiceTotal(0));
    dispatch(resetInvoiceItemList());
    dispatch(resetInvoiceEmailTo());
    
    const vendorEmail =  selectedVendorObj.target.options.item(selectedVendorObj.target.selectedIndex).getAttribute("data-email");
    if(vendorEmail != undefined && vendorEmail != EMPTY_STRING) {
      dispatch(setInvoiceEmailTo(vendorEmail.trim()));
    }
    
    //Call Address table to get all the addresses by vendor
    
    const projectListResponse = await accountService.getProjectsByVendor(selectedVendorObj.target.value, userService.getAccountDetails().accountId);

    console.log("projectListResponse::"+JSON.stringify(projectListResponse))
    
    setProjectList(projectListResponse);
    setProjectId(EMPTY_STRING);

  } 

  function handleInvoiceType(invoiceTypeValue) {
    console.log("handleInvoiceType:::"+invoiceTypeValue);
    setInvoiceType(invoiceTypeValue)
    setValue("total",0)
    dispatch(setInvoiceTotal(0));
    dispatch(resetInvoiceItemList());

  }

  function handleInvoiceDate(e) {
    if(e != undefined && (e.updatedDate || (!e.updatedDate && invoiceDate === undefined))) {
      setInvoiceDate(util.getFormattedDate(e.date))

    }
  }

  function handleDueDate(e) {
    if(e != undefined && e.updatedDate) {
      setDueDte(util.getFormattedDate(e.date))
    }
  }


  async function handleProjectSelection(e) {
    
    if(projectId === "" || projectId === undefined) {
      setEnableInvoiceItemAdd(false);
      dispatch(resetProjectResources())
      setProjectType("");
  
    }
    setValue("total",0)
    dispatch(setInvoiceTotal(0));
    setProjectId(e.target.value);
    dispatch(resetInvoiceItemList());
    dispatch(removeEmailFromInvoiceEmailListByIndex(1));
    setEnableInvoiceItemAdd(true);
    setEnableEmailIcon(true);
    dispatch(setProjectResources(JSON.parse(e.target.options.item(e.target.selectedIndex).getAttribute("data-projectResources"))))
    setProjectType(e.target.options.item(e.target.selectedIndex).getAttribute("data-projectType"));

    const projectEmail =  e.target.options.item(e.target.selectedIndex).getAttribute("data-email");
    if(projectEmail != undefined && projectEmail != EMPTY_STRING) {
      dispatch(setInvoiceEmailTo(projectEmail.trim()));
    }

    const projectPaymentTerm =  e.target.options.item(e.target.selectedIndex).getAttribute("data-paymentTerm");
    if(projectPaymentTerm != undefined && projectPaymentTerm != EMPTY_STRING) {
      setValue("paymentTerms", projectPaymentTerm)
      if(invoiceDate != undefined && invoiceDate != EMPTY_STRING) {
        setDueDte(util.getDueDateByPayTerms(new Date(invoiceDate.toString()), projectPaymentTerm))
      }else {
        setDueDte(util.getDueDateByPayTerms(new Date(), projectPaymentTerm))
      }
      
    }


    return;
  } 
 
  function handlePaymentTerms(projectPaymentTerm) {
    if(projectPaymentTerm != undefined && projectPaymentTerm != EMPTY_STRING) {
      if(invoiceDate != undefined && invoiceDate != EMPTY_STRING) {
        setDueDte(util.getDueDateByPayTerms(new Date(invoiceDate.toString()), projectPaymentTerm))
      }else {
        setDueDte(util.getDueDateByPayTerms(new Date(), projectPaymentTerm))
      }
      
    }
  }
    

  function onSubmit(data) {
    if(invoiceTotal) {
      data.total = invoiceTotal
    }
    return isAddMode
        ? createInvoice(data)
        : updateInvoice(invoiceId, data);
  }

  // Create Account 
  const createInvoice = async (formData) => {
    try {
        if(invoiceItemList?.length <= 0 ) {
          toast({
            title: 'Invoice Error.',
            description: 'Add at least one item to submit this invoice.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
          return;
        }
        const responseData = await invoiceService.createNewInvoice(formData, invoiceItemList, invoiceDate, dueDte, invoiceEmailTos);
        if(!responseData.error) {
          toast({
            title: 'New Invoice.',
            description: 'Successfully added new invoice.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          if(selectedVendorId != undefined && selectedVendorId != null) {
            router.push("/account/vendor/invoices");
          }else {
            router.push("/account/invoices");
          }
          
        }else {
          toast({
            title: 'Invoice Error.',
            description: 'Not able to create invoice, plrease try again or contact administrator.',
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
      if(invoiceItemList?.length <= 0 ) {
        toast({
          title: 'Invoice Error.',
          description: 'Add at least one item to submit this invoice.',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
        return;
      }else {
        const invoiceItemStatuses = invoiceItemList.map((invoiceItem)=> {
                if(invoiceItem.type === InvoiceType.Expense) {
                  if(invoiceItem.expense?.status === ExpenseStatus.Invoiced 
                    || invoiceItem.expense?.status === ExpenseStatus.Paid
                    || invoiceItem.expense?.status === ExpenseStatus.PartiallyPaid) {
                      return false;
                    }else {
                      return true;
                    }
                } else if(invoiceItem.type === InvoiceType.Timesheet) {
                  if(invoiceItem.timesheetEntry?.status === TimesheetStatus.Invoiced 
                    || invoiceItem.timesheetEntry?.status === TimesheetStatus.Paid
                    || invoiceItem.timesheetEntry?.status === TimesheetStatus.PartiallyPaid) {
                      return false;
                    }else {
                      return true;
                    }
                }                
        })
        if(invoiceItemStatuses.includes(false)) {
          toast({
            title: 'Invoice Error.',
            description: 'One of the invoice item is already invoiced/paid, so remove that item before submitting.',
            status: 'error',
            position: 'top',
            duration: 6000,
            isClosable: true,
          })
          return;
        }
      }
      const responseData = await invoiceService.updateInvoice(formData, invoiceId, invoiceDate, dueDte,invoiceItemList, invoiceTotal, invoiceEmailTos);

      if(!responseData.error) {
        toast({
          title: 'Update Invoice.',
          description: 'Successfully updated invoice.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        if(selectedVendorId != undefined && selectedVendorId != null) {
          router.push("/account/vendor/invoices");
        }else {
          router.push("/account/invoices");
        }
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
          
          {isAddMode ? (
              <div>{isVendor? (<PageMainHeader heading="New Vendor Invoice"/>): (<PageMainHeader heading="New Account Invoice"/>)}</div>
          ) : (
            <div>{isVendor? (<PageMainHeader heading="Update Vendor Invoice" notesData={notesData}/>): (<PageMainHeader heading="Update Account Invoice" notesData={notesData}/>)}</div>
          )}    
          <InvoiceDetailActions data={{isAddMode: isAddMode, status: status, invoiceId: invoiceId}}/>
          <Flex>
          <Box width="page.sub_heading_width">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size='xs'>Invoice Details {invoiceId ? (<> for {invoiceId}</>) : (<></>)} </Heading>
                </CardHeader>

                <CardBody>
                  <Stack spacing={4}>
                      <Box>
                        <FormControl isRequired>
                          <FormLabel>Invoice Reference/Details</FormLabel>
                          <Input type="text" {...register('description')}  id="description"    maxWidth="page.single_input" />
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
                            <Select width="100%" id="paymentTerms" {...register('paymentTerms')}  onChange={(ev) => handlePaymentTerms(ev.target.value)}>
                              {INVOICE_PAY_TERMS?.map((paymentTerm) => (
                                    <option value={paymentTerm.paymentTermId}>{paymentTerm.paymentTermName}</option>
                              ))}                                
                            </Select>
                          </FormControl>     
                        </Box>  
                        <Box>
                          <FormControl isRequired>
                            <FormLabel>Invoice Status</FormLabel>
                                {(status === InvoiceConstants.INVOICE_STATUS.Paid || status === InvoiceConstants.INVOICE_STATUS.PartiallyPaid) ? (<>
                                  <Badge color={`${
                                    status === "Paid"
                                      ? "paid_status"
                                      : status === "Pending"
                                      ? "pending_status"
                                      : status === "PartiallyPaid"
                                      ? "paid_status"
                                      : "pending_status"
                                  }`}>{status}</Badge>                            
                                </>) : (<>
                                  <Select width="100%" id="status" {...register('status')} >
                                      {INVOICE_STATUS?.map((invoiceStatus) => (
                                              <option value={invoiceStatus.invoiceStatusId}>{invoiceStatus.invoiceStatusName}</option>
                                      ))}   
                                  </Select>

                                </>)}
                          </FormControl>     
                        </Box>  
                      </HStack>                          
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader>
                  <Heading size='xs'>User Account/Vendor Details</Heading>
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
                                <Select width="100%" id="vendorId" {...register('vendorId')} onChange={(ev) => refreshProjectForVendor(ev)}>
                                    <option value="">Select an Vendor</option>
                                    {vendorList?.map((vendor) => (
                                      <option value={vendor.id} data-email={vendor.email}>{vendor.name}</option>
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
                                      <option value={project.id} data-paymentTerm={project.paymentTerms} data-email={project.contactEmail} data-projectType={project.type} data-projectResources={JSON.stringify(project.projectResource)}>{project.name}</option>
                                  ))}
                                </Select>
                              ) : (<>
                              <Text>
                                {projectName}
                              </Text>
                                
                              </>)}
                            </FormControl>     
                        </Box>  
                        <Box>
                          {enableEmailIcon ? (<>
                            <FormControl>
                                <FormLabel>&nbsp;</FormLabel>
                                <InvoiceEmailTo/>
                            </FormControl>
                          </>) : (<></>)}
                        </Box>                        
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>              
              <Card>
                <CardHeader>
                  <Heading size='xs'>Invoice Payment Details</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <HStack spacing="5.5rem">
                      <Box>
                          <FormLabel>Invoice Date</FormLabel>
                          <HStack>
                            <Input type="text" id="invoiceDate"  value={util.getFormattedDate(invoiceDate)}  {...register('invoiceDate')}/>
                            <DatePicker onChange={handleInvoiceDate}/> 
                          </HStack>
                      </Box>
                      <Box>
                           <FormLabel>Due Date</FormLabel>
                          <HStack>
                            <Input type="text" id="dueDte"  value={util.getFormattedDate(dueDte)}  {...register('dueDte')}/>
                            <DatePicker onChange={handleDueDate}/> 
                          </HStack>  
                      </Box>  
                    </HStack>                                        
                    <HStack spacing="6rem">
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
                            
                            <Input type="number" id="total"  value={invoiceTotal}  {...register('total')} />
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
                                  <Input type="number" value={invoicePaidAmount} isReadOnly/>
                              </InputGroup>                             
                          </FormControl>    
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
                  <CardHeader>
                    <Heading size='xs'>Invoice Items</Heading>
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
                  <Button size="xs" bgColor="header_actions"  onClick={() => router.push("/accounts")}>
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    {(status != InvoiceConstants.INVOICE_STATUS.Paid || status != InvoiceConstants.INVOICE_STATUS.PartiallyPaid) ? (<>
                      <Button size="xs" bgColor="header_actions" type="submit">
                        {isAddMode ? (
                            <div>Add New Invoice</div>
                        ) : (
                          <div>Update Invoice</div>
                        )}              
                      </Button>
                    </>) : (<></>)}
                  </Box>
                </HStack>
              </Flex>                   
            </Stack>
          </form>          
        </Box>
        </Flex>
      </div>
      ) : (
        <> 
        <PageNotAuthorized/>      
      </>
      )}
    </div>

  );
};

export default InvoiceAddEdit;
