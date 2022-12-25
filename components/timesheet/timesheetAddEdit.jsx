import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { util } from '../../helpers';
import { accountService, userService } from "../../services";
import {MODE_ADD, TIMESHEET_VALIDATION_SCHEMA, USER_ROLES} from "../../constants/accountConstants";


import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Card,
  CardHeader,
  CardBody,
  StackDivider
} from '@chakra-ui/react'
import WeeklyTimesheetEntry from "./weeklyTimesheetEntry";

const TimesheetAddEdit = (props) => {
  
  const timesheetId = props.data.timesheetId;
  const router = useRouter();

  const name = useRef("");
  const email = useRef("");
  const type = useRef("");
  // const userId = useRef("");
  const userId = 7;


  const [timesheetActivityList, setTimesheetActivityList] = useState([]);
  const [userProjectList, setUserProjectList] = useState([]);
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
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) {
      setPageAuthorized(true);
    }

    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isManager()) {
      getProjectForUser(userId);
    }else if(userService.isTimesheetEntryUser()) {
      // getProjectForUser(userService.getAccountDetails().accountId);
      getProjectForUser(7);
    }

    
    getTimesheetDetailsAPICall();


  }, []);

  function handleTimeSheetEntries(timesheetEntriesList) {
    console.log("handleTimeSheet Entries :::"+JSON.stringify(timesheetEntriesList));
    setTimesheetActivityList(timesheetEntriesList);
  }

  async function getProjectForUser(userId) {
    console.log("TimeSheet ADD EDIT ::"+JSON.stringify(userId));
    const projectsForUserResponse = await userService.getProjectsByUser(userId, userService.getAccountDetails().accountId);    
    setUserProjectList(projectsForUserResponse);
  }

  async function getTimesheetDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
          && (props && props.data && props.data.mode != MODE_ADD)) {
      
            
    }

  }

  function onSubmit(data) {
    
    return isAddMode
        ? createTimesheet(data)
        : updateTimesheet(timesheetId, data);
  }

  // Create Account 
  const createTimesheet = async (formData) => {
    try {
      console.log("Create Timesheet::"+formData.status+"-----timesheetActivityList:::"+JSON.stringify(timesheetActivityList))
        const res = await fetch("/api/timesheet/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Week Starting 1/1",
            type: "Weekly",
            userId: 7,
            status: formData.status,
            timesheetEntries: {
              create: timesheetActivityList
            }
          }), 
        });
        const data = await res.json();

        toast.success(data.message);
        router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
        
      
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };



  // update invoice in database
  const updateTimesheet = async (timesheetId, formData) => {
    console.log("JSON Data::"+JSON.stringify(formData))
    try {
      const res = await fetch(`/api/account/vendor/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(timesheetId),
          name: formData.name,
          type: "Weekly"
        }),
      });

      const data = await res.json();
      
      router.push("/account/"+userService.getAccountDetails().accountId+"/vendors");
      toast.success(data.message);
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!");
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
                  <WeeklyTimesheetEntry data={{onSubmit: onSubmit, handleTimeSheetEntries: handleTimeSheetEntries, userProjectList: userProjectList}}></WeeklyTimesheetEntry>
            </form>          
          </Box>

        </div>
      ) : (
        <> 
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1.5rem"
          bg="teal.500"
          color="white"
          marginBottom="2rem"
          width="100%"
        >
          <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
            Not authorized to view this page. Please contact administrator.
          </Heading>
        </Flex>        
      </>
      )}
    </div>

  );
};

export default TimesheetAddEdit;
