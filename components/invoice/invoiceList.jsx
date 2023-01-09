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


const InvoiceList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.invoiceList;
  const { requestMode } = props.invoiceList;
  const [invoiceList, setInvoiceList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

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
      setInvoiceList(responseData);

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

              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button className="btn" onClick={navigatePage}>
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
              <Table>
              <TableCaption></TableCaption>
                <Thead>
                    <Tr bgColor="table_tile">
                      <Th>
                        Invoice ID
                      </Th>
                      <Th>
                        Invoice Type
                      </Th>
                      <Th>
                        Vendor Name
                      </Th>
                      <Th>
                        Account Name
                      </Th>
                      <Th>
                        Invoice Date
                      </Th>
                      <Th>
                        Invoice Due Date
                      </Th>
                      <Th>
                        Invoice Amount
                      </Th>
                      <Th>
                        Invoice Balance
                      </Th>
                      <Th>
                        Invoice Status
                      </Th>
                    </Tr>   
                  </Thead>                
                  <Tbody>
                    {invoiceList?.map((invoice) => (
                      
                      
                      <Tr>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>  
                                {invoice.id}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>                              
                                {invoice.type}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                                {invoice.vendor.name}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                                {invoice.account.name}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                                {util.getFormattedDate(invoice.invoiceDate)}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                                {util.getFormattedDate(invoice.dueDte)}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                               $ {invoice.total}
                              </Text>
                            </Th>
                            <Th>
                              <Text pt='table_display_value' fontSize='table_display_value'>
                               $ {parseFloat(invoice.total)-util.getZeroPriceForNull(invoice.paidAmount)}
                              </Text>
                            </Th>
                            <Th>
                              <HStack>
                                <Button onClick={() => handleInvoiceDetailSelection(invoice.id)}>
                                    Details
                                  </Button>
                                <Badge color={`${
                                    invoice.status === "Paid"
                                      ? "paid_status"
                                      : invoice.status === "Pending"
                                      ? "pending_status"
                                      : "pending_status"
                                  }`}>{invoice.status}</Badge>
                              </HStack>
                            </Th>
                          
                        </Tr>

                    ))}
                </Tbody>    
              </Table>
              </TableContainer>
          </div>
      ) : (
          <PageNotAuthorized/>
      ) }



      
      </div>    
  );
};

export default InvoiceList;
