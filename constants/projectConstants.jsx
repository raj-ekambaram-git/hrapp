import {
  Badge,
} from '@chakra-ui/react'

export const ProjectConstants = {

  PROJECT_RESOURCE_TABLE_FIELDS: [
    {
      Header: "",
      accessor: "deleteAction"
    },
    {
      Header: "",
      accessor: "editAction"
    },    
    {
      Header: "User",
      accessor: "userName"
    },
    {
      Header: "Type",
      accessor: "type"
    },
    {
      Header: "Budget",
      accessor: "budgetAllocatedWithDollar",
    },
    {
      Header: "Price",
      accessor: "unitPrice"
    },
    {
      Header: "Currency",
      accessor: "currency"
    },
    {
      Header: "Quantity",
      accessor: "quantity"
    },
    {
      Header: "UOM",
      accessor: "uom"
    },
    {
      Header: "Timesheet Approver",
      accessor: "isTimesheetApprover"
    },
                         
  ],
  PROJECT_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Name",
      accessor: "name"
    },    
    {
      label: "Type",
      accessor: "type"
    },
    {
      label: "Budget",
      accessor: "budget",
      format: (value) => (value ? "$ "+value: '✖️')
    },
    {
      label: "Account",
      accessor: "accountName",
    },
    {
      label: "Vendor",
      accessor: "vendorName"
    },
    {
      label: "Updated",
      accessor: "createdDate"
    },
    {
      label: "",
      accessor: "detailAction"
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${(value === "Created" ||value === "Open" )? "paid_status":value === "Closed"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
    }
                         
  ]


}
