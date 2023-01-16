import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useForm } from 'react-hook-form';
import { timesheetService, userService } from "../../services";
import {MODE_ADD} from "../../constants/accountConstants";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
import {
  Box,
  useToast
} from '@chakra-ui/react'
import WeeklyTimesheetEntry from "./weeklyTimesheetEntry";
import { useSelector } from "react-redux";
import { PageMainHeader } from "../../components/common/pageMainHeader";
import { NotesConstants } from "../../constants";


const TimesheetAddEdit = (props) => {
  
  const timesheetId = props.data.timesheetId;
  const router = useRouter();
  const toast = useToast();
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  

  const notesData = {
    type: NotesConstants.NOTES_TYPE.Timesheet,
    typeId: parseInt(timesheetId),
    typeName: NotesConstants.NOTES_TYPE.Timesheet
  }

  //User Validation START
  const formOptions = {};

  // get functions to build form with useForm() hook
  const { handleSubmit, formState } = useForm(formOptions);

  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) {
      setPageAuthorized(true);
    }
  }, []);


  const tsEntries = useSelector(state => state.timesheet.timesheetEntries);
  console.log("TS Entries ::"+JSON.stringify(tsEntries));

  function onSubmit(data) {
    return isAddMode
        ? createTimesheet(data)
        : updateTimesheet(timesheetId, data);
  }

  // Create Account 
  const createTimesheet = async (formData) => {
    try {
      console.log("Create Timesheet::"+JSON.stringify(formData)+"-----timesheetActivityList:::"+JSON.stringify(tsEntries)+"--TimesheetName::"+formData.timesheetName)
        const responseData = await timesheetService.createTimesheet(formData, userService.userValue.id, tsEntries);
        if(responseData.error) {
          toast({
            title: 'New Timesheet.',
            description: 'Not able to create timesheet, plrease try again or contact administrator.',
            status: 'error',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          
        }else {
          toast({
            title: 'New Timesheet.',
            description: 'Successfully created new timesheet.',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          router.push("/account/user/timesheets");
        }
      
    } catch (error) {
      toast({
        title: 'Timesheet Error.',
        description: 'Not able to create timesheet, plrease try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };



  // update invoice in database
  const updateTimesheet = async (timesheetId, formData) => {
    console.log("JSON Data::"+JSON.stringify(formData)+"tsEntries::"+JSON.stringify(tsEntries))
    try {
      const responseData = await timesheetService.updateTimesheet(formData, timesheetId, tsEntries);
      if(responseData.error) {
        toast({
          title: 'Timesheet Error.',
          description: 'Not able to update timesheet, plrease try again or contact administrator. Details:'+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
  

      }else {
        router.push("/account/user/timesheets");
        toast({
          title: 'Update Timesheet.',
          description: 'Successfully updated timesheet.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      }

    } catch (error) {
      console.log(error)
      toast({
        title: 'Timesheet Error.',
        description: 'Not able to update timesheet, plrease try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
    }
  };


  return (
    <div>
      {isPageAuthprized ? (
        <div> 
          {isAddMode ? (
              <PageMainHeader heading="New Timesheet"/>
          ) : (
              <PageMainHeader heading="Update Timesheet" notesData={notesData}/>
          )}              
          <Box width="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
                  <WeeklyTimesheetEntry data={{userId: userService.userValue.id, timesheetId: timesheetId, isAddMode: isAddMode, onSubmit: onSubmit}}></WeeklyTimesheetEntry>
            </form>          
          </Box>

        </div>
      ) : (
        <> 
            <PageNotAuthorized/>
        </>
      )}
    </div>

  );
};

export default TimesheetAddEdit;
