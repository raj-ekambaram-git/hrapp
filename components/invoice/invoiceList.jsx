import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { accountService, invoiceService, userService } from "../../services";

import {
  HStack,
  Button,
  Box,
  Flex,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { util } from "../../helpers";
import {PageMainHeader} from '../../components/common/pageMainHeader'
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized'
import { useDispatch } from "react-redux";
import { setSelectedInvoiceId } from "../../store/modules/Invoice/actions";
import { EMPTY_STRING, InvoiceConstants } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteConfirmDialog from "../common/deleteConfirmDialog";
import { InvoiceStatus } from "@prisma/client";



const InvoiceList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const { data } = props.invoiceList;
  const { requestMode } = props.invoiceList;
  const [invoiceList, setInvoiceList] = useState([]);
  const invoiceListRef = useRef(["1","2"]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const INVOICE_LIST_TABLE_COLUMNS = React.useMemo(() => InvoiceConstants.INVOICE_LIST_TABLE_META)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dialogRef = useRef("Delete");


  useEffect(() => {

    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isAccountVendorRep())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
       if(requestMode == "VENDOR") {
          getInvoiceListByVendor(data.vendorId, "NaN")
        }else if (requestMode == "PROJECT") {
          getInvoiceListByProject(data.projectId, "NaN")
        }else {
          getInvoiceListByAccount(data.accountId)
        }
        
      }else {
        if(requestMode == "VENDOR") {
          getInvoiceListByVendor(data.vendorId, userService.getAccountDetails().accountId)
        }else if (requestMode == "PROJECT") {
          getInvoiceListByProject(data.projectId, userService.getAccountDetails().accountId)
        }else {
          getInvoiceListByAccount(data.accountId)
        }
        
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isAccountVendorRep()) {      
        if(requestMode == "VENDOR") {
          getInvoiceListByVendor("", data.accountId)
        }else if (requestMode == "PROJECT") {
          getInvoiceListByProject(data.projectId, userService.getAccountDetails().accountId)
        }else {
          getInvoiceListByAccount(userService.getAccountDetails().accountId)
        }
        
        setPageAuthorized(true);
      }

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getInvoiceListByVendor(vendorId, accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByVendor(vendorId, accountId);
      console.log("Response Data:::"+JSON.stringify(responseData))
      if(responseData != undefined && responseData != EMPTY_STRING) {
        invoiceListRef.current = responseData;
        setInvoiceList(updateInvoicesForDisplay(responseData) );
      }

    }

    async function getInvoiceListByProject(projectId, accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByProject(projectId, accountId);
      console.log("invoiceListRef:::"+JSON.stringify(invoiceListRef))
      
      if(responseData != undefined && responseData != EMPTY_STRING) {
        invoiceListRef.current = responseData;
        // updateInvoicesForDisplay(responseData)
        setInvoiceList(updateInvoicesForDisplay(responseData) );
      }

    }    

    function updateInvoicesForDisplay(responseData) {
      return responseData.map((invoice)=> {
        invoice.deleteAction = <><HStack spacing={6}>{(invoice.status === InvoiceStatus.Draft)?(<DeleteIcon color="red" size="xs" onClick={() => handleInvoiceDeleteSelection(invoice.id)}/>):(<Box marginRight={3}></Box>)}<Box>{invoice.id}</Box></HStack></>
        invoice.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleInvoiceDetailSelection(invoice.id)}>Details</Button>
        // invoice.status = <Badge color={`${(invoice.status === "Paid" || invoice.status === "PartiallyPaid") ? "paid_status": invoice.status === "Pending" ? "pending_status": "pending_status"}`}>{invoice.status}</Badge>
        invoice.amount = "$ "+(parseFloat(invoice.total))
        invoice.balance = (parseFloat(invoice.total)-util.getZeroPriceForNull(invoice.paidAmount))
        invoice.paidAmount = "$ "+(util.getZeroPriceForNull(invoice.paidAmount))
        invoice.formattedInvoiceDate = util.getFormattedDate(invoice.invoiceDate)
        invoice.formattedDueDate = util.getFormattedDate(invoice.dueDte)
        invoice.vendorName = invoice.vendor?.name
        invoice.accountName = invoice.account?.name
        invoice.projectName = invoice.project?.name
        return invoice;
      });
      // setInvoiceList(updatedInvoiceList)
    }

  const handleInvoiceDeleteSelection = (invoiceId) => {
    dialogRef.current = invoiceId;
    onOpen();

  }

  const handleDeleteConfirmation = async (invoiceInput) => {
    const responseData = await invoiceService.markInvoiceDelete(invoiceInput.current, userService.getAccountDetails().accountId) 
    if(responseData.error) {
      toast({
        title: 'Delete Invoicce.',
        description: 'Error deleting invoice',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }else {
      toast({
        title: 'Delete Invoicce.',
        description: 'Successfully deleted invoice.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
      const newInvoiceList = [...invoiceListRef.current]
      const invoiceToRemoveIndex = newInvoiceList.findIndex(x => x.id === invoiceInput.current);
      newInvoiceList.splice(invoiceToRemoveIndex, 1);
      invoiceListRef.current = newInvoiceList;
      setInvoiceList(updateInvoicesForDisplay(newInvoiceList));      
      onClose()
    }
  }
  

    async function getInvoiceListByAccount(accountId) {
      const responseData = await accountService.getInvoiceListByAccount(accountId);
      if(responseData != undefined && responseData != EMPTY_STRING) {
        invoiceListRef.current = responseData;
        setInvoiceList(updateInvoicesForDisplay(responseData) );
      }
    }    

    function handleInvoiceDetailSelection(invoiceId) {
      dispatch(setSelectedInvoiceId(invoiceId))
      router.push("/account/invoice/detail");
  
    }

    let navigatePage;
    if(requestMode == "VENDOR") {
       navigatePage = () => router.push({ pathname: '/account/invoice/add', query: { vendor: true, vendorId: data.vendorId }});
    }else if (requestMode == "PROJECT") {
      navigatePage = () => router.push({ pathname: '/account/invoice/add', query: { vendor: false }});
    }else {
      navigatePage = () => router.push({ pathname: '/account/invoice/add', query: { vendor: false }});
    }
  
  
  

  return (

    <div>
      {isPageAuthprized ? (
        <div>
              {requestMode == "VENDOR" ? (
                <PageMainHeader heading="Vendor Invoices"/>
              ) : requestMode == "PROJECT" ? (
                <PageMainHeader heading="Project Invoices"/>
              ) : (
                <PageMainHeader heading="Account Invoices"/>
              )}
              <DeleteConfirmDialog        
                  deleteHeader="Delete Invoice"
                  dialogRef={dialogRef}
                  isOpen={isOpen}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                  onClose={onClose}/>

              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigatePage}>
                      {requestMode == "VENDOR" ? (
                        <>Add New Vendor Invoice</>
                      ) : requestMode == "PROJECT" ? (
                        <>Add New Project Invoice</>
                      ) : (
                        <>Add New Account Invoice</>
                      )}
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable  columns={INVOICE_LIST_TABLE_COLUMNS} rows={invoiceList} />
          </div>
      ) : (
          <PageNotAuthorized/>
      ) }



      
      </div>    
  );
};

export default InvoiceList;
