import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";

import {
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Flex,
  TableContainer,
  TableCaption,
  Badge,
  Text
} from '@chakra-ui/react'
import { util } from "../../helpers";
import {PageMainHeader} from '../../components/common/pageMainHeader'
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized'
import { useDispatch } from "react-redux";
import { setSelectedInvoiceId } from "../../store/modules/Invoice/actions";
import { EMPTY_STRING, InvoiceConstants } from "../../constants";
import SortTable from "../common/SortTable";


const InvoiceList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.invoiceList;
  const { requestMode } = props.invoiceList;
  const [invoiceList, setInvoiceList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const INVOICE_LIST_TABLE_COLUMNS = React.useMemo(() => InvoiceConstants.INVOICE_LIST_TABLE_META)

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
      setInvoiceList(responseData);

    }

    async function getInvoiceListByProject(projectId, accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByProject(projectId, accountId);
      setInvoiceList(responseData);

    }    

    async function getInvoiceListByAccount(accountId) {
      console.log("getInvoiceListByAccount:::"+accountId)
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByAccount(accountId);
      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedInvoiceList =  responseData.map((invoice, index)=> {
          invoice.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleInvoiceDetailSelection(invoice.id)}>Details</Button>
          invoice.status = <Badge color={`${(invoice.status === "Paid" || invoice.status === "PartiallyPaid") ? "paid_status": invoice.status === "Pending" ? "pending_status": "pending_status"}`}>{invoice.status}</Badge>
          invoice.amount = "$ "+(parseFloat(invoice.total)-util.getZeroPriceForNull(invoice.paidAmount))
          invoice.paidAmount = "$ "+(parseFloat(invoice.total)-util.getZeroPriceForNull(invoice.paidAmount))
          invoice.formattedInvoiceDate = util.getFormattedDate(invoice.invoiceDate)
          invoice.formattedDueDate = util.getFormattedDate(invoice.dueDte)
          return invoice;
        });
        setInvoiceList(updatedInvoiceList );
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
              ) : (
                <PageMainHeader heading="Account Invoices"/>
              )}

              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigatePage}>
                      {requestMode == "VENDOR" ? (
                        <>Add New Vendor Invoice</>
                      ) : (
                        <>Add New Account Invoice</>
                      )}
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <TableContainer display="flex">
                <SortTable  variant="sortTable" columns={INVOICE_LIST_TABLE_COLUMNS} data={invoiceList} />
              </TableContainer>
          </div>
      ) : (
          <PageNotAuthorized/>
      ) }



      
      </div>    
  );
};

export default InvoiceList;
