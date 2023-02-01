import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";
import {
  Box,
  Flex,
  Heading,
} from '@chakra-ui/react'

import { PageNotAuthorized } from "../common/pageNotAuthorized";
import ProjectTimesheets from './projectTImesheets';
import { useDispatch, useSelector } from "react-redux";
import { fetchTimesheetsForApproval } from "../../store/modules/Timesheet/actions";
import {PageMainHeader} from '../common/pageMainHeader';

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
          <Box width="page.sub_heading_width">
              {isManager ? (
                <PageMainHeader heading="Timesheets to Approve"/>
              ) : (
                <PageMainHeader heading="Timesheets"/>
              )}
              <ProjectTimesheets/>
          </Box>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default TimesheetApprovalList;
