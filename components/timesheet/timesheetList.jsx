import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
  TableContainer,
  Badge
} from '@chakra-ui/react'
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch } from "react-redux";
import { setSelectedTimesheetId } from "../../store/modules/Timesheet/actions";
import { TimesheetConstants } from "../../constants/timesheetConstants";
import { CustomTable } from "../../components/customTable/Table";
import { util } from "../../helpers";
import { EMPTY_STRING } from "../../constants";



const TimesheetList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.userData;
  const { isManager } = props.userData;
  const [timesheetList, setTimesheetList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const TIMESHEET_LIST_TABLE_COLUMNS = React.useMemo(() => TimesheetConstants.TIMESHEET_LIST_TABLE_META)

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

      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedTimesheetist =  responseData.map((timesheet, index)=> {
          timesheet.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleTimesheetSelection(timesheet.id)}>Details</Button>
          timesheet.status = <Badge color={`${timesheet.status === "Approved"? "timesheet.approved_status": (timesheet.status === "Submitted" || timesheet.status === "Saved")? "timesheet.approved_status": "timesheet.pending_status"}`}>{timesheet.status}</Badge>
          timesheet.lastUpdateDate = util.getFormattedDate(timesheet.lastUpdateDate)
          timesheet.createdDate = util.getFormattedDate(timesheet.createdDate)
          return timesheet;
        });
        setTimesheetList(updatedTimesheetist);
      }
    }

    function handleTimesheetSelection(timesheetId){
      dispatch(setSelectedTimesheetId(timesheetId))
      router.push("/timesheet");
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
    
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions"  onClick={navigatePage}>
                        Add New Timesheet
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable variant="sortTable" columns={TIMESHEET_LIST_TABLE_COLUMNS} rows={timesheetList} />
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
