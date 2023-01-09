import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userService } from "../../services";
import {MODE_ADD, TIMESHEET_VALIDATION_SCHEMA} from "../../constants/accountConstants";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
import {
  Box,
  Flex,
  Heading,
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
  const [timesheetActivityList, setTimesheetActivityList] = useState([]);
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

  function handleTimeSheetEntries(timesheetEntriesList) {
    console.log("handleTimeSheet Entries :::"+JSON.stringify(timesheetEntriesList));
    setTimesheetActivityList(timesheetEntriesList);
  }

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
      console.log("Create Timesheet::"+JSON.stringify(formData)+"-----timesheetActivityList:::"+JSON.stringify(timesheetActivityList)+"--TimesheetName::"+formData.timesheetName)
        const res = await fetch("/api/timesheet/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.timesheetName,
            type: "Weekly",
            userId: userService.userValue.id,
            status: formData.status,
            startDate: formData.timesheetStartDate,
            timesheetEntries: {
              create: timesheetActivityList
            }
          }), 
        });
        const data = await res.json();

        toast({
          title: 'New Timesheet.',
          description: 'Successfully created new timesheet.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        router.push("/account/user/timesheets");
        
      
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
    console.log("JSON Data::"+JSON.stringify(formData))
    try {
      const res = await fetch(`/api/timesheet/${timesheetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(timesheetId),
          name: formData.name,
          startDate: formData.timesheetStartDate,
          type: "Weekly",
          status: formData.status,
          timesheetEntries: timesheetActivityList
        }),
      });

      const data = await res.json();
      
      router.push("/account/user/timesheets");
      toast({
        title: 'Update Timesheet.',
        description: 'Successfully updated timesheet.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })

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
                  <WeeklyTimesheetEntry data={{userId: userService.userValue.id, timesheetId: timesheetId, isAddMode: isAddMode, onSubmit: onSubmit, handleTimeSheetEntries: handleTimeSheetEntries}}></WeeklyTimesheetEntry>
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
