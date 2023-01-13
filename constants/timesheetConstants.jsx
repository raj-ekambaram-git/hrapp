import {
  Badge,
} from '@chakra-ui/react'

export const TimesheetConstants = {

  
  TIMESHEET_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Timesheet",
      accessor: "name"
    },    
    {
      label: "Created",
      accessor: "createdDate"
    },
    {
      label: "Updated",
      accessor: "lastUpdateDate"
    },
    {
      label: "",
      accessor: "detailAction",
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Approved"? "timesheet.approved_status": (value === "Submitted" || value === "Saved")? "timesheet.approved_status": "timesheet.pending_status"}`}>{value}</Badge>  : '✖️')
    }               
  ]


}
