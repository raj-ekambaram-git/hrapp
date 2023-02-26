import { Badge } from "@chakra-ui/react";
import { util } from "../helpers";

export const ScheduleJobConstants = {

  RECURRING_INTERVALS: [
    {
      recurringIntervalId: "Daily",
      recurringIntervalName: "Daily"
    },    
    {
      recurringIntervalId: "Weekly",
      recurringIntervalName: "Weekly"
    },    
    {
      recurringIntervalId: "Monthly",
      recurringIntervalName: "Monthly"
    },    
    {
      recurringIntervalId: "Quarterly",
      recurringIntervalName: "Quarterly"
    },    
], 
  JOB_LIST_TABLE_META: [
        {
          label: "Name",
          accessor: "jobName"
        },    
        {
          label: "Status",
          accessor: "jobStatus", 
          format: (value) => (value ? <Badge color={`${(value == "SCHEDULED" || value == "RUNNING" || value == "COMPLETE") ? "paid_status": "pending_status"}`}>{value}</Badge> : '✖️')
        },
        {
          label: "Scheduled",
          accessor: "scheduleTime",
          format: (value) => (value ? util.getFormattedDateWithTime(value) : '-')
        },   
        {
          label: "Last Ran",
          accessor: "lastFiredTime",
          format: (value) => (value ? util.getFormattedDateWithTime(value) : '-')
        },          
        {
          label: "Next Run",
          accessor: "nextFireTime",
          format: (value) => (value ? util.getFormattedDateWithTime(value) : '-')
        },   
                             
      ]

}