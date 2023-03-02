import { Badge } from "@chakra-ui/react";
import { util } from "../helpers";

export const ScheduleJobConstants = {
  WEEKLY_TS_REMINDER_TEMPLATE_NAME: "UserWeeklyTimesheetReminder",
  INVOICE_DUE_REMINDER_TEMPLATE_NAME: "DailyInvoiceDueReminder",
  JOB_NAME_PREFIX: {
    WEEKLY_TS_REMINDER: "WeeklyTimesheetReminder",
    INVOICE_DUE_REMINDER: "InvoiceDueReminder"
  },
  JOB_GROUP_SUFFIX: {
    REMINDER: "_Reminder",
    INVOICE_DUE_REMINDER: "_InvoiceDueReminder",
  },
  JOB_STATUS: {
    Pause: "Pause",
    Resume: "Resume",
    Cancel: "Cancel",
    Delete: "Delete"
  },
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
          label: "",
          accessor: "deleteAction",
          disableSort: true,
          disableSearch: true
        },  
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
          format: (value) => (value ? <Badge color={`${(value == "RUNNING" || value == "COMPLETE") ? "paid_status": value == "SCHEDULED"?"black": "pending_status"}`}>{value}</Badge> : '✖️')
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
        {
          label: "",
          accessor: "updateActions",
          disableSort: true,
          disableSearch: true
        },  

         
                             
      ]

}