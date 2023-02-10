import { Badge } from "@chakra-ui/react";

export const ScheduleJobConstants = {
   
  JOB_LIST_TABLE_META: [
        {
          label: "Type",
          accessor: "type"
        },    
        {
          label: "Name",
          accessor: "name"
        },
        {
          label: "Description",
          accessor: "description"
        }, 
        {
          label: "Updated By",
          accessor: "updatedBy",
        },
        {
          label: "Status",
          accessor: "status", 
          format: (value) => (value ? <Badge color={`${(value === "Active") ? "paid_status": value === "Inactive" ? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
        },
        {
          label: "",
          accessor: "toggleStatus", 
          disableSearch: true,
          disableSort: true          
        }
                             
      ]

}