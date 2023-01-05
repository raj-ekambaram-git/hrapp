import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { accountService, userService } from "../../services";
import {USER_ROLE_DESC} from "../../constants/accountConstants";
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



const UserList = (props) => {
  const router = useRouter();
  const { data } = props.userList;
  const { isVendor } = props.userList;
  console.log("UserList::"+JSON.stringify(data))
  const [usersList, setUsersList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isVendor) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getUsersList(data.vendorId, "NaN")
      }else {
        getUsersList(data.vendorId, userService.getAccountDetails().accountId)
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getUsersList("", data.accountId)
      }else {
        getUsersList("", userService.getAccountDetails().accountId)
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
                    {usersList?.map((user) => (
                      
                      
                      <Tr>
                            <Th>
                            {user.id}
                            </Th>
                            <Th>
                              {user.firstName}
                            </Th>
                            <Th>
                              {user.lastName}
                            </Th>
                            <Th>
                              {user.email}
                            </Th>
                            <Th>
                              {user.role ? (<>{USER_ROLE_DESC[user.role]}</>) : "N/A"}
                            </Th>
                            <Th>
                              {user.account.name}
                            </Th>
                            <Th>
                              {user.vendor ? (
                                <>{user.vendor.name}</>
                              ) : "N/A"}
                            </Th>
                            <Th>
                              {user.createdDate}
                            </Th>
                            <Th>
                              <HStack>
                                <Link href={`/account/user/${user.id}`} passref key={user.id}>
                                  <Button className="btn">
                                    Details
                                  </Button>
                                </Link>
                                <Badge color={`${
                                    user.status === "Active"
                                      ? "paid_status"
                                      : user.status === "Inactive"
                                      ? "pending_status"
                                      : "pending_status"
                                  }`}>{user.status}</Badge>
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
          <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default UserList;
