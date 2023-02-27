import { Badge } from "@chakra-ui/react";
import { util } from "../helpers";

export const ScheduleJobConstants = {

  RECURRING_INTERVAL_VALUE: {
    Daily: "Daily",
    Weekly: "Weekly",
    Monthly: "Monthly",
    Quarterly: "Quarterly"
  },
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
          accessor: "jobName",
          format: (value) => (value ? value.split("_")[0] : '✖️')
        },    
        {
          label: "Type",
          accessor: "typeName"
        },
        {
          label: "Status",
          accessor: "jobStatus", 
          format: (value) => (value ? <Badge color={`${(value == "SCHEDULED" || value == "RUNNING" || value == "COMPLETE") ? "paid_status": "pending_status"}`}>{value}</Badge> : '✖️')
        },
        {
          label: "Scheduled",
          accessor: "scheduleTime",
          format: (value) => (value ? new Date(value).toLocaleString() : '-')
        },   
        {
          label: "Last Ran",
          accessor: "lastFiredTime",
          format: (value) => (value ? new Date(value).toLocaleString() : '-')
        },          
        {
          label: "Next Run",
          accessor: "nextFireTime",
          format: (value) => (value ? new Date(value).toLocaleString() : '-')
        },   
                             
      ]

}