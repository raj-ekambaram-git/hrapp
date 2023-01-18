import React from "react";
import { useSelector } from "react-redux";
import TimesheetList from "../../../components/timesheet/timesheetList";
import { userService } from "../../../services";


export default function UserTimesheets(props) {
  // const userId = useSelector(state => state.user.loggedInUser?.id);
  const userId = userService?.userValue?.id;

  console.log("UserTimesheets::::"+userId)
  const data = {
    action: "userTimesheetList",
    userId: userId
  }

  return (
        
    <TimesheetList userData={{ data: data, isManager: false }} /> 

  );
}