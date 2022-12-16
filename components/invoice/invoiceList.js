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
  const { isVendor } = props.invoiceList;
  console.log("invoiceList::"+JSON.stringify(data))
  const [invoiceList, setInvoiceList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isVendor && (userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isAccountVendorRep())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getInvoiceList(data.vendorId, "NaN")
      }else {
        getInvoiceList(data.vendorId, userService.getAccountDetails().accountId)
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isAccountVendorRep()) {      
        if(userService.isSuperAdmin()) {
          getInvoiceList("", data.accountId)
        }else {
          getInvoiceList("", userService.getAccountDetails().accountId)
        }
        
        setPageAuthorized(true);
      }

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getInvoiceList(vendorId, accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getInvoiceList(vendorId, accountId);
      setInvoiceList(responseData);

    }

    let navigatePage;
    if(isVendor) {
       navigatePage = () => router.push({ pathname: '/account/invoice/add', query: { vendor: isVendor, vendorId: data.vendorId }});
    }else {
        navigatePage = () => router.push({ pathname: '/account/invoice/add', query: { vendor: isVendor }});
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
                  {isVendor ? (
                    <>Vendor Invoices</>
                  ) : (
                    <>Account Users</>
                  )}
                  
                </Heading>
              </Flex>
    
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button className="btn" onClick={navigatePage}>
                      {isVendor ? (
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
                              {invoice.createdDate}
                            </Th>
                            <Th>
                              {invoice.dueDate}
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
