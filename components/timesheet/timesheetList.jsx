import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { timesheetService, userService } from "../../services";
import {
  HStack,
  Button,
  Flex,
  Checkbox,
  useToast,
  Box,
  useDisclosure
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
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteConfirmDialog from "../common/deleteConfirmDialog";



const TimesheetList = (props) => {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const { data } = props.userData;
  const { isManager } = props.userData;
  const [timesheetList, setTimesheetList] = useState([]);
  const timesheetListRef = useRef([]);
  const [timesheetsToDelete, setTimesheetsToDelete] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const TIMESHEET_LIST_TABLE_COLUMNS = React.useMemo(() => TimesheetConstants.TIMESHEET_LIST_TABLE_META)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dialogRef = useRef("Delete");


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
  
  const handleTimesheetDeleteSelection = (timesheetId) => {
    dialogRef.current = timesheetId;
    onOpen();

  }

  /**
   * Function to get the list of accounts for a drop down
   */
    async function getTimesheetList(userId, accountId) {
      const responseData = await userService.getTimesheetByUser(userId, accountId);
      timesheetListRef.current = responseData;

      if(responseData != undefined && responseData != EMPTY_STRING) {
        timesheetListRef.current = responseData;
        updateTimesheetListForTable(responseData)
      }
    }

    const updateTimesheetListForTable = (responseData) => {
      const updatedTimesheetist =  responseData.map((timesheet, index)=> {
        timesheet.deleteAction = <><HStack spacing={6}>{timesheetService.isTimesheetDeletable(timesheet)?(<DeleteIcon size="xs" onClick={() => handleTimesheetDeleteSelection(timesheet.id)}/>):(<Box marginRight={3}></Box>)}<Box>{timesheet.id}</Box></HStack></>
        timesheet.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleTimesheetSelection(timesheet.id)}>Details</Button>
        // timesheet.status = 
        timesheet.lastUpdateDate = util.getFormattedDate(timesheet.lastUpdateDate)
        timesheet.createdDate = util.getFormattedDate(timesheet.createdDate)
        return timesheet;
      });
      setTimesheetList(updatedTimesheetist);
    }


    const handleDeleteConfirmation = async (projectInput) => {
      const responseData = await timesheetService.markTimesheetDelete(projectInput.current, userService.getAccountDetails().accountId) 
      if(responseData.error) {
        toast({
          title: 'Delete Timesheet.',
          description: 'Error deleting timesheet',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }else {
        toast({
          title: 'Delete Timesheet.',
          description: 'Successfully deleted timesheet.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        const newTimesheetList = [...timesheetListRef.current]
        const timesheetToRemoveIndex = newTimesheetList.findIndex(x => x.id === projectInput.current);
        newTimesheetList.splice(timesheetToRemoveIndex, 1);
        updateTimesheetListForTable(newTimesheetList)
        timesheetListRef.current = newTimesheetList;
        onClose()
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
              <DeleteConfirmDialog        
                  deleteHeader="Delete Project"
                  dialogRef={dialogRef}
                  isOpen={isOpen}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                  onClose={onClose}/>

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
