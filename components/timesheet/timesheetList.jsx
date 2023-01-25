import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";
import {
  HStack,
  Button,
  Flex,
  Checkbox,
  useToast
} from '@chakra-ui/react'
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch } from "react-redux";
import { setnewTSWeekStartDimId, setSelectedTimesheetId } from "../../store/modules/Timesheet/actions";
import { TimesheetConstants } from "../../constants/timesheetConstants";
import { CustomTable } from "../../components/customTable/Table";
import { util } from "../../helpers";
import { EMPTY_STRING } from "../../constants";
import { TimesheetStatus } from "@prisma/client";



const TimesheetList = (props) => {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const { data } = props.userData;
  const { isManager } = props.userData;
  const [timesheetList, setTimesheetList] = useState([]);
  const [timesheetsToDelete, setTimesheetsToDelete] = useState([]);
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
  
  const handleAddTimesheetToDelete = (e) => {
    if(e.target.checked) { 
      timesheetsToDelete.push(e.target.value)
    }else {
      const newSelectedTSEId = [...timesheetsToDelete]
      const teseToRemoveIndex = newSelectedTSEId.findIndex(x => x === parseInt(e.target.value));
      newSelectedTSEId.splice(teseToRemoveIndex, 1);
      setTimesheetsToDelete(newSelectedTSEId);
    }    
  }

  const deleteTimesheet = () => {
    console.log("deleteTimesheet:::"+JSON.stringify(timesheetsToDelete))
    if(timesheetsToDelete.length >0) {
      //Call the service to delete
    }else {
      toast({
        title: 'Timesheet Delete Error.',
        description: 'Add at least one item to delete.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }

  }


    /**
   * Function to get the list of accounts for a drop down
   */
    async function getTimesheetList(userId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getTimesheetByUser(userId, accountId);

      if(responseData != undefined && responseData != EMPTY_STRING) {
        const updatedTimesheetist =  responseData.map((timesheet, index)=> {
          if(timesheet.status === TimesheetStatus.Draft || timesheet.status === TimesheetStatus.Saved) {            
            // timesheet.deleteAction = <Checkbox value={timesheet.id} onChange={(e) => handleAddTimesheetToDelete(e)}/>    
          }
          timesheet.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleTimesheetSelection(timesheet.id)}>Details</Button>
          // timesheet.status = 
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
  
    function handleAddNewTS() {
      dispatch(setnewTSWeekStartDimId(null))
      router.push({ pathname: '/timesheet/add', query: { manager: isManager }});
    }
  
  

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
                    <Button size="xs" bgColor="header_actions"   onClick={handleAddNewTS}>
                        Add New Timesheet
                    </Button>
                    {/* <Button size="xs" bgColor="header_actions"   onClick={deleteTimesheet}>
                        Delete Timesheet
                    </Button>                     */}
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
