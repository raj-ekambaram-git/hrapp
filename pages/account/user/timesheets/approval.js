import React from "react";
import { useSelector } from "react-redux";
import TimesheetApprovalList from "../../../../components/timesheet/timesheetApprovalList";


export default function TimesheetApproval(props) {

  const userId = useSelector(state => state.user.loggedInUser?.id);

  const data = {
    action: "userTimesheetApprovalList",
    userId: userId
  }
  return (
    <TimesheetApprovalList userData={{ data: data, isManager: true, isApprovalList: true }} /> 
  );
}
