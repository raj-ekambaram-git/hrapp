import React, { useState, useRef } from "react";
import TimesheetApprovalList from "../../../../../components/timesheet/timesheetApprovalList";


export default function TimesheetApproval(props) {
  console.log("TimesheetApproval::"+JSON.stringify(props))
  const { data } = props;

  return (
        
    <TimesheetApprovalList userData={{ data: data, isManager: true, isApprovalList: true }} /> 

  );
}

export async function getStaticPaths() {

  return {
    paths: [{ params: { userId: "5" } }],
    fallback: true,
  };

} 

export async function getStaticProps(context) {
  console.log("TIMESHEET ENTRY...")
  const { userId } = context.params;
  console.log("USER ID TIMESHEET ::"+userId);

  return {
    props: {
      data: {
        action: "userTimesheetApprovalList",
        userId: userId
      }
    },
    revalidate: 1,
  };


}