import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";

import {
  HStack,
  Button,
  Box,
  Flex,
  Badge
} from '@chakra-ui/react'
import { PageMainHeader } from "../common/pageMainHeader";
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_STRING, UserConstants, USER_ROLE_DESC } from "../../constants";
import { CustomTable } from "../customTable/Table";
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
            // user.user.role = <Tooltip label={user.user.userRole.map((role) => <p>{role}</p>)}>Role</Tooltip>
            user.user.role = user.user.userRole.map((role) => <p>{role}</p>)
            user.user.vendorName = user.vendor?.name ? (<>{user.vendor?.name}</>) : "N/A"
            user.user.accountName = user.vendor.account?.name ? (<>{user.vendor.account?.name}</>) : "N/A"
            user.user.createdDate = util.getFormattedDate(user.user.createdDate)
            user.user.userAction = <Button size="xs" bgColor="header_actions" onClick={() => handleUserEditSelection(user.user.id)}>Edit</Button>
            user.user.status = <Badge color={`${(user.user.status === "Active" || user.user.status === "Approved")? "paid_status" : "pending_status"}`}>{user.user.status}</Badge>
            return user.user;
          }else {
            user.role = user.userRole.map((role) => <p>{USER_ROLE_DESC[role]}</p>)
            user.vendorName = user.vendor?.name ? (<>{user.vendor?.name}</>) : "N/A"
            user.accountName = user.account?.name ? (<>{user.account?.name}</>) : "N/A"
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
              {isVendor ? (
                <CustomTable  variant="sortTable" columns={USER_VENDOR_LIST_TABLE_COLUMNS} rows={usersList} />
              ) : (
                <CustomTable  variant="sortTable" columns={USER_ACCOUNT_LIST_TABLE_COLUMNS} rows={usersList} />
              )}                
              
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
