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
  const userId = useRef("");


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
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);
    }

    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) {
      setPageAuthorized(true);
    }

    getTimesheetDetailsAPICall();

  }, []);

  function handleTimeSheetEntries(timesheetEntriesList) {
    console.log("handleTimeSheet Entries :::"+JSON.stringify(timesheetEntriesList));
    setTimesheetActivityList(timesheetEntriesList);
  }

  async function getTimesheetDetailsAPICall() {

    // Call only if the user is SUPER_ADMIN and accountId as zero
    if((userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) 
          && (props && props.data && props.data.mode != MODE_ADD)) {
      
      // const vendorResponse = await accountService.getVendorDetail(props.data.vendorId, userService.getAccountDetails().accountId);
      //   const vendorData =  {
      //       id: vendorResponse.id.toString(),
      //       name: vendorResponse.name,
      //       description: vendorResponse.description,
      //       email: vendorResponse.email,
      //       type: vendorResponse.type,
      //       phone: vendorResponse.phone,
      //       accountId: vendorResponse.accountId,
      //       ein: vendorResponse.ein,
      //       status: vendorResponse.status,
      //       accountContactName: vendorResponse.accountContactName,
      //       accountContactEmail: vendorResponse.accountContactEmail,
      //       accountContactPhone: vendorResponse.accountContactPhone,
      //       addressId: vendorResponse.address[0].id,
      //       addressName: vendorResponse.address[0].addressName,
      //       address1: vendorResponse.address[0].address1,
      //       address2: vendorResponse.address[0].address2,
      //       address3: vendorResponse.address[0].address3,
      //       city: vendorResponse.address[0].city,
      //       state: vendorResponse.address[0].state,
      //       zipCode: vendorResponse.address[0].zipCode,
      //       country: vendorResponse.address[0].country
      //   };

      //   setVendor(vendorData);

      //   // get user and set form fields
      //       const fields = ['name', "description", "email", "type","phone","accountId", "ein","status","accountContactName","accountContactEmail","accountContactPhone","addressName","address1", "address2", "address3","city","state","zipCode"];
      //       fields.forEach(field => setValue(field, vendorData[field]));
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
      console.log("Create Veendorrr::"+JSON.stringify(formData))
        const res = await fetch("/api/account/vendor/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            type: "Weekly",
            timesheetActivity: {
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
                  <WeeklyTimesheetEntry data={{handleTimeSheetEntries: handleTimeSheetEntries}}></WeeklyTimesheetEntry>
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
