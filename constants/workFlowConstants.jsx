import { Badge } from "@chakra-ui/react";

export const WorkFlowConstants = {
    WORKFLOW_TYPE: {
        'Vendor': 'Vendor',
        'Invoice': 'Invoice',
        'Project': 'Project',
        'User': 'User',
    },
    WORKFLOW_TYPE_LOOKIUP: [
      {
        key: "Vendor",
        displayName: "Vendor"
      },
      {
        key: "Invoice",
        displayName: "Invoice"
      },
      {
        key: "Project",
        displayName: "Project"
      },
      {
        key: "User",
        displayName: "User"
      },      
    ],
    WORKFLOW_STATUS: {
        "Active": "Active",
        "Inactive": "Inactive",
        "Draft": "Draft",

    },
    WORKFLOW_STATUS_LOOKIUP: [
      {
        key: "Active",
        displayName: "Active"
      },
      {
        key: "Inactive",
        displayName: "Inactive"
      },
      {
        key: "Draft",
        displayName: "Draft"
      }, 
    ],    
    TASK_LIST_TABLE_META: [
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