import React, { useState, useRef } from "react";
import TimesheetList from "../../../../components/timesheet/timesheetList";


export default function UserTimesheets(props) {
  console.log("TIMESHEETSc44444::"+JSON.stringify(props))
  const { data } = props;

  return (
        
    <TimesheetList userData={{ data: data, isManager: false }} /> 

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
        action: "userTimesheetList",
        userId: userId
      }
    },
    revalidate: 1,
  };


}