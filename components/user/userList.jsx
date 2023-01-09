import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";

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
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { UserListForAccount } from "./userListForAccount";
import { UserListForVendor } from "./userListForVendor";
import { useSelector } from "react-redux";



const UserList = (props) => {
  const router = useRouter();
  const { data } = props.userList;
  const { isVendor } = props.userList;
  const [usersList, setUsersList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  const accountId = useSelector(state => state.account.selectedAccountId);
  

  useEffect(() => {

    if(isVendor) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getUsersList(data.vendorId, "NaN")
      }else {
        getUsersList(data.vendorId, accountId)
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getUsersList("", accountId)
      }else {
        getUsersList("", accountId)
      }
      
     setPageAuthorized(true);

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getUsersList(vendorId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getUsersByVendor(vendorId, accountId);

      console.log("USERS LIST:::"+JSON.stringify(responseData));
      setUsersList(responseData);

    }

  
  const navigatePage = () => router.push({ pathname: '/account/user/add', query: { vendor: isVendor }});
  

  return (

    <div>
      {isPageAuthprized ? (
        <div>

              {isVendor ? (
                <PageMainHeader heading="Vendor Users"/>
              ) : (
                <PageMainHeader heading="Account Users"/>
              )}
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button  onClick={navigatePage}>
                      {isVendor ? (
                        <>Add New Vendor User</>
                      ) : (
                        <>Add New Account User</>
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
                        User ID
                      </Th>
                      <Th>
                        First Name
                      </Th>
                      <Th>
                        Last Name
                      </Th>
                      <Th>
                        User ID/Email
                      </Th>
                      <Th>
                        Role
                      </Th>
                      <Th>
                        Account Name
                      </Th>
                      <Th>
                        Vendor Name
                      </Th>
                      <Th>
                        Created Date
                      </Th>
                      <Th>
                        User Status
                      </Th>
                    </Tr>   
                  </Thead>                
                  <Tbody>
                    {isVendor ? (
                        <UserListForVendor usersList={usersList}/>
                      ) : (
                        <UserListForAccount usersList={usersList}/>
                      )}
                </Tbody>    
              </Table>
              </TableContainer>
          </div>
      ) : (
        <> 
          <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default UserList;
