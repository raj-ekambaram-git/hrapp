import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userService } from "../../services";
import {EMPTY_STRING, MODE_ADD, TIMESHEET_VALIDATION_SCHEMA} from "../../constants/accountConstants";
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";

import {
  Box,
  Flex,
  Heading,
  useToast
} from '@chakra-ui/react'
import WeeklyTimesheetEntry from "./weeklyTimesheetEntry";

const TimesheetAddEdit = (props) => {
  
  const timesheetId = props.data.timesheetId;
  const router = useRouter();
  const toast = useToast();
  const name = useRef("");
  const email = useRef("");
  const type = useRef("");
  // const userId = useRef("");
  const userId = userService.userValue.id;


  const [timesheetActivityList, setTimesheetActivityList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);

  
  
  //User Validation START
  const formOptions = { resolver: yupResolver(TIMESHEET_VALIDATION_SCHEMA) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setValue, formState } = useForm(formOptions);
  const { errors } = formState;


  const navigateTimesheetListPage = () => router.push({ pathname: '/timesheet/'+userService.getAccountDetails().accountId+'/vendors', query: {} });

  //Get Account Details only if its EditMode
  useEffect(() => {
    console.log("props.data.mode::"+JSON.stringify(props.data.mode))
    if(props && props.data && props.data.mode != MODE_ADD) {
      console.log("setting add mode to false...")
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


  function onSubmit(data) {
    
    return isAddMode
        ? createTimesheet(data)
        : updateTimesheet(timesheetId, data);
  }

  // Create Account 
  const createTimesheet = async (formData) => {
    try {
      console.log("Create Timesheet::"+formData.status+"-----timesheetActivityList:::"+JSON.stringify(timesheetActivityList)+"--TimesheetName::"+formData.timesheetName)
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
        router.push("/account/user/"+userService.userValue.id+"/timesheets");
        
      
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
          type: "Weekly",
          status: formData.status,
          timesheetEntries: timesheetActivityList
        }),
      });

      const data = await res.json();
      
      router.push("/account/user/"+userService.userValue.id+"/timesheets");
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
               {isAddMode ? (
                    <div>New Timesheet</div>
                ) : (
                    <div>Update Timesheet</div>
                )}              
            </Heading>
          </Flex>
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
