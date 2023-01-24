import {
  Badge,
} from '@chakra-ui/react'

export const ProjectConstants = {

  EXPENSE_LIST_TABLE_META: [
    {
      label: "",
      accessor: "enableAddtoInvoiceCheckBox",
      disableSearch: true
    },
    {
      label: "Name",
      accessor: "name"
    },
    {
      label: "Resource",
      accessor: "resource"
    },    
    {
      label: "Amount",
      accessor: "totalAmount",
    },
    {
      label: "",
      accessor: "detailAction",
      disableSearch: true
    },    
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ?<Badge color={`${(value !== "Rejected" )? "paid_status": "pending_status"}`}>{value}</Badge> : '✖️')
      
    },
    {
      label: "Approved On",
      accessor: "approvedOn",
    },
    {
      label: "Approved By",
      accessor: "approvedBy"
    },
    {
      label: "Last Updated",
      accessor: "lastUpdated"
    },
                         
  ],
  TIMESHEET_LIST_TABLE_META: [
    {
      label: "",
      accessor: "enableAddtoInvoiceCheckBox"
    },
    {
      label: "Name",
      accessor: "name"
    },
    {
      label: "Resource",
      accessor: "resource"
    },    
    {
      label: "Hours",
      accessor: "totalHours"
    },
    {
      label: "",
      accessor: "detailAction",
      disableSearch: true
    },  
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${(value!== "Rejected" )? "paid_status": "pending_status"}`}>{value}</Badge> : '✖️')
      
    },
    {
      label: "Approved On",
      accessor: "approvedOn",
    },
    {
      label: "Approved By",
      accessor: "approvedBy"
    },
    {
      label: "Last Updated",
      accessor: "lastUpdated"
    },
                         
  ],
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
      accessor: "detailAction",
      disableSearch: true
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${(value === "Created" ||value === "Open" )? "paid_status":value === "Closed"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
    }
                         
  ]


}
