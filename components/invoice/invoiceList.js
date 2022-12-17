import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
  Heading,
  TableContainer,
  TableCaption,
  Badge
} from '@chakra-ui/react'

const UserList = (props) => {
  const router = useRouter();
  const { data } = props.invoiceList;
  const { requestMode } = props.invoiceList;
  console.log("MMMMMMM invoiceList::"+JSON.stringify(data))
  console.log("Uodates requestMode::"+JSON.stringify(requestMode))
  const [invoiceList, setInvoiceList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isAccountVendorRep())) {
      console.log("11111")
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        console.log("22222")
        if(requestMode == "VENDOR") {
          console.log("33333")
          getInvoiceListByVendor(data.vendorId, "NaN")
        }else if (requestMode == "PROJECT") {
          console.log("44444")
          getInvoiceListByProject(data.projectId, "NaN")
        }else {
          console.log("55555")
          getInvoiceListByAccount(data.accountId)
        }
        
      }else {
        console.log("66666")
        if(requestMode == "VENDOR") {
          console.log("77777")
          getInvoiceListByVendor(data.vendorId, userService.getAccountDetails().accountId)
        }else if (requestMode == "PROJECT") {
          coconsole.lognsole("999999")
          getInvoiceListByProject(data.projectId, userService.getAccountDetails().accountId)
        }else {
          console.log("99999")
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
      console.log("rgetInvoiceListByVendor::::esoinse :+"+JSON.stringify(responseData))
      setInvoiceList(responseData);

    }

    async function getInvoiceListByProject(projectId, accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByProject(projectId, accountId);
      console.log("getInvoiceListByProject :::resoinse :+"+JSON.stringify(responseData))
      setInvoiceList(responseData);

    }    

    async function getInvoiceListByAccount(accountId) {
      console.log("getInvoiceListByAccount:::"+accountId)
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceListByAccount(accountId);
      console.log("rgetInvoiceListByVendor::::esoinse :+"+JSON.stringify(responseData))
      setInvoiceList(responseData);

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
                  {requestMode == "VENDOR" ? (
                    <>Vendor Invoices</>
                  ) : (
                    <>Account Invoices</>
                  )}
                  
                </Heading>
              </Flex>
    
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
                              {invoice.id}
                            </Th>
                            <Th>
                              {invoice.type}
                            </Th>
                            <Th>
                              {invoice.vendor.name}
                            </Th>
                            <Th>
                              {invoice.account.name}
                            </Th>
                            <Th>
                              {invoice.invoiceDate}
                            </Th>
                            <Th>
                              {invoice.dueDte}
                            </Th>
                            <Th>
                              {invoice.total}
                            </Th>
                            <Th>
                              {invoice.paidAmount}
                            </Th>
                            <Th>
                              <HStack>
                                <Link href={`/account/invoice/${invoice.id}`} passref key={invoice.id}>
                                  <Button className="btn">
                                    Details
                                  </Button>
                                </Link>
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
      ) }



      
      </div>    
  );
};

export default UserList;
