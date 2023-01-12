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
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, UserConstants, USER_ROLE_DESC } from "../../constants";
import SortTable from "../common/SortTable";
import { util } from "../../helpers";
import { setSelectedUserId } from "../../store/modules/User/actions";


const UserList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.userList;
  const { isVendor } = props.userList;
  const [usersList, setUsersList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const USER_ACCOUNT_LIST_TABLE_COLUMNS = React.useMemo(() => UserConstants.USER_ACCOUNT_LIST_TABLE_META)
  const USER_VENDOR_LIST_TABLE_COLUMNS = React.useMemo(() => UserConstants.USER_VENDOR_LIST_TABLE_META)

  const accountId = useSelector(state => state.account.selectedAccountId);
  
  function handleUserEditSelection(userId){
    dispatch(setSelectedUserId(userId))
    router.push("/account/user/edit");

  }
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
      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedUserList =  responseData.map((user, index)=> {
          if(isVendor) {
            user.user.role = user.user.role ? (<>{USER_ROLE_DESC[user.user.role]}</>) : "N/A"
            user.user.vendorName = user.vendor?.name ? (<>{user.vendor?.name}</>) : "N/A"
            user.user.createdDate = util.getFormattedDate(user.user.createdDate)
            user.user.userAction = <Button size="xs" bgColor="header_actions" onClick={() => handleUserEditSelection(user.user.id)}>Edit</Button>
            user.user.status = <Badge color={`${(user.user.status === "Active" || user.user.status === "Approved")? "paid_status" : "pending_status"}`}>{user.user.status}</Badge>

          }else {
            user.role = user.role ? (<>{USER_ROLE_DESC[user.role]}</>) : "N/A"
            user.vendorName = user.vendor?.name ? (<>{user.vendor?.name}</>) : "N/A"
            user.createdDate = util.getFormattedDate(user.createdDate)
            user.userAction = <Button size="xs" bgColor="header_actions" onClick={() => handleUserEditSelection(user.id)}>Edit</Button>
            user.status = <Badge color={`${(user.status === "Active" || user.status === "Approved")? "paid_status" : "pending_status"}`}>{user.status}</Badge>
          }
          return user;
        });
        setUsersList(updatedUserList);
      }      
      

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
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button  size="xs" bgColor="header_actions" onClick={navigatePage}>
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
                      {isVendor ? (
                        <SortTable  variant="sortTable" columns={USER_VENDOR_LIST_TABLE_COLUMNS} data={usersList} />
                      ) : (
                        <SortTable  variant="sortTable" columns={USER_ACCOUNT_LIST_TABLE_COLUMNS} data={usersList} />
                      )}                
              {/* <Table>
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
              </Table> */}
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
