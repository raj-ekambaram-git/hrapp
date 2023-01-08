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
import { PageMainHeader } from "../common/pageMainHeader";

const VendorList = (props) => {
  const router = useRouter();
  const { data } = props.vendorList;
  
  console.log("VendorList::"+JSON.stringify(data))
  const [vendorList, setVendorList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isValidAccount(data.accountId) || userService.isSuperAdmin() ) {
      setPageAuthorized(true);
      getVendorList(data.accountId);
    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getVendorList(accountId) {
      // setPageAuthorized(true);
      const responseData = await accountService.getVendorList(accountId);
      setVendorList(responseData);

  }

  
  const navigatePage = () => router.push({ pathname: '/account/vendor/add', query: { kkkk: "value" } });
  

  return (


    <div>
      {isPageAuthprized ? (
        <div>
              <PageMainHeader heading="Account Vendors"/>    
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button className="btn" onClick={navigatePage}>
                      Add New Vendor 
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <Flex>
                  <TableContainer>
                    <Table>
                    <TableCaption></TableCaption>
                      <Thead>
                          <Tr bgColor="table_tile">
                            <Th>
                              Vendor ID
                            </Th>
                            <Th>
                              Vendor Name
                            </Th>
                            <Th>
                              Vendor Type
                            </Th>
                            <Th>
                              Vendor Contact Email
                            </Th>
                            <Th>
                              Vendor Contact Phone
                            </Th>
                            <Th>
                              Vendor EIN
                            </Th>
                            <Th>
                              Vendor Created Date
                            </Th>
                            <Th>
                              Vendor Status
                            </Th>
                          </Tr>   
                        </Thead>                
                        <Tbody>
                          {vendorList?.map((vendor) => (
                            
                            
                            <Tr>
                                  <Th>
                                    {vendor.id}
                                  </Th>
                                  <Th>
                                    {vendor.name}
                                  </Th>
                                  <Th>
                                    {vendor.type}
                                  </Th>
                                  <Th>
                                    {vendor.email}
                                  </Th>
                                  <Th>
                                    {vendor.phone}
                                  </Th>
                                  <Th>
                                    {vendor.ein}
                                  </Th>  
                                  <Th>
                                    {vendor.createdDate}
                                  </Th> 
                                  <Th>
                                    <HStack>
                                      {/* <Link href={`/account/vendor/${vendor.id}/detail`} passref key={vendor.id}>
                                        <Button className="btn">
                                          Details
                                        </Button>
                                      </Link> */}
                                    <Button className="btn" onClick={() => router.push(`/account/vendor/${vendor.id}/detail`)}>
                                      Vendor Details
                                    </Button>
                                      <Badge color={`${
                                          vendor.status === "Active"
                                            ? "paid_status"
                                            : vendor.status === "Inactive"
                                            ? "pending_status"
                                            : "pending_status"
                                        }`}>{vendor.status}</Badge>
                                    </HStack>
                                  </Th>
                                
                              </Tr>

                          ))}
                      </Tbody>    
                    </Table>
                  </TableContainer>
                </Flex>
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

export default VendorList;
