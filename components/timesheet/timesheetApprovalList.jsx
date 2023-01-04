import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";
import {
  Flex,
  Heading,
} from '@chakra-ui/react'

import { PageNotAuthorized } from "../common/pageNotAuthorized";
import ProjectTimesheets from './projectTImesheets';
import { useDispatch, useSelector } from "react-redux";
import { fetchTimesheetsForApproval } from "../../store/modules/Timesheet/actions";

const TimesheetApprovalList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = props.userData;
  const { isManager } = props.userData;
  const { isApprovalList } = props.userData;
  const [isPageAuthprized, setPageAuthorized] = useState(false);

  useEffect(() => {

    if(isManager && isApprovalList && (userService.isManager() || userService.isAccountAdmin())) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        dispatch(fetchTimesheetsForApproval(userId, "NaN"));
      }else {
        dispatch(fetchTimesheetsForApproval(data.userId, userService.getAccountDetails().accountId));
      }
      setPageAuthorized(true);
    }

  }, []);
  
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
              <ProjectTimesheets/>
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
