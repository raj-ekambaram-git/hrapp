import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
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
  const VENDOR_LIST_TABLE_COLUMNS = React.useMemo(() => VendorConstants.VENDOR_LIST_TABLE_META)

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
                <SortTable variant="sortTable" columns={VENDOR_LIST_TABLE_COLUMNS} data={vendorList} />
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
