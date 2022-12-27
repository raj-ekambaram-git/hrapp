import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";
import {
  Flex,
  Heading,
} from '@chakra-ui/react'

import { PageNotAuthorized } from "../common/pageNotAuthorized";
import ProjectTimesheets from './projectTImesheets';

const TimesheetApprovalList = (props) => {
  const router = useRouter();
  const { data } = props.userData;
  const { isManager } = props.userData;
  const { isApprovalList } = props.userData;
  console.log("timesheetList::"+JSON.stringify(props))
  const [timesheetApprovalList, setTimesheetApprovalList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isManager && isApprovalList) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getTimesheetApprovalList(data.userId, "NaN");
      }else {
        getTimesheetApprovalList(data.userId, userService.getAccountDetails().accountId);
      }
      setPageAuthorized(true);
    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getTimesheetApprovalList(userId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getTimesheetApprovalByUser(userId, accountId);
      setTimesheetApprovalList(responseData);

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
                  {isManager ? (
                    <>Timesheets to Approve</>
                  ) : (
                    <>Timesheets</>
                  )}
                  
                </Heading>
              </Flex>
              <ProjectTimesheets timesheetList={timesheetApprovalList}/>
          </div>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default TimesheetApprovalList;
