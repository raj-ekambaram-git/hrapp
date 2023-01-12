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
import { setSelectedVendorId } from "../../store/modules/Vendor/actions";
import { useDispatch } from "react-redux";
import { VendorConstants } from "../../constants/vendorConstants";
import { EMPTY_STRING } from "../../constants";
import SortTable from "../common/SortTable";


const VendorList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.vendorList;
  const VENDOR_LIST_TABLE_COLUMNS = React.useMemo(() => VendorConstants.VENDOR_LIST)

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
      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedVendorList =  responseData.map((vendor, index)=> {
          vendor.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleVendorDetailSelection(vendor.id)}>Vendor Details</Button>
          vendor.status = <Badge color={`${
            vendor.status === "Active" ? "paid_status": vendor.status === "Inactive"? "pending_status": "pending_status"}`}>{vendor.status}</Badge>
          return vendor;
        });
        setVendorList(updatedVendorList );
      }
      

  }
  
  function handleVendorDetailSelection(vendorId) {
    dispatch(setSelectedVendorId(vendorId))
    router.push("/account/vendor/detail");
  }

  
  const navigatePage = () => router.push({ pathname: '/account/vendor/add', query: { kkkk: "value" } });
  

  return (


    <div>
      {isPageAuthprized ? (
        <div>
              <PageMainHeader heading="Account Vendors"/>    
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions" onClick={navigatePage}>
                      Add New Vendor 
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <Flex>
                <SortTable varian="dasd" columns={VENDOR_LIST_TABLE_COLUMNS} data={vendorList} />
                    {/* <Table>
                    <TableCaption></TableCaption>
                      <Thead>
                          <Tr>
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
                                    <Button size="xs" bgColor="header_actions" onClick={() => handleVendorDetailSelection(vendor.id)}>
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
                    </Table> */}
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
