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
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { PageMainHeader } from "../common/pageMainHeader";

const TimesheetList = (props) => {
  const router = useRouter();
  const { data } = props.userData;
  const { isManager } = props.userData;
  console.log("timesheetList::"+JSON.stringify(props))
  const [timesheetList, setTimesheetList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isManager) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getTimesheetList(data.userId, "NaN");
      }else {
        getTimesheetList(data.userId, userService.getAccountDetails().accountId);
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getTimesheetList(data.userId, "NaN");
      }else {
        getTimesheetList(data.userId, userService.getAccountDetails().accountId);
      }
      
     setPageAuthorized(true);

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getTimesheetList(userId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getTimesheetByUser(userId, accountId);
      setTimesheetList(responseData);

    }

  
  const navigatePage = () => router.push({ pathname: '/timesheet/add', query: { manager: isManager }});
  

  return (

    <div>
      {isPageAuthprized ? (
        <div>
              {isManager ? (
                <PageMainHeader heading="Timesheets to Approve"/>
              ) : (
                <PageMainHeader heading="Timesheets"/>
              )}
    
              <Flex marginBottom="2rem">
                <HStack>
                  <Box>
                    <Button className="btn" onClick={navigatePage}>
                        Add New Timesheet
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
                        TImesheet
                      </Th>
                      <Th>
                        Type
                      </Th>
                      <Th>
                        Created Date
                      </Th>
                      <Th>
                        Last Updated
                      </Th>
                      <Th>
                        Status
                      </Th>
                    </Tr>   
                  </Thead>                
                  <Tbody>
                    {timesheetList?.map((timesheet) => (
                      
                      
                      <Tr>
                            <Th>
                            {timesheet.name}
                            </Th>
                            <Th>
                              {timesheet.type}
                            </Th>
                            <Th>
                              {timesheet.createdDate}
                            </Th>
                            <Th>
                              {timesheet.lastUpdateDate}
                            </Th>
                            <Th>
                              <HStack>
                                <Link href={`/timesheet/${timesheet.id}`}>
                                  <Button className="btn">
                                    Details
                                  </Button>
                                </Link>
                                <Badge color={`${
                                      timesheet.status === "Approved"
                                      ? "timesheet.approved_status"
                                      : (timesheet.status === "Submitted" || timesheet.status === "Saved")
                                      ? "timesheet.pending_status"
                                      : "timesheet.pending_status"
                                  }`}>{timesheet.status}</Badge>
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

export default TimesheetList;
