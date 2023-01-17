import {
  Badge,
} from '@chakra-ui/react'
import { EMPTY_STRING } from './accountConstants'

export const ExpenseConstants = {
  EXPENSE_STATUS: {
    'Draft': 'Draft',
    'Saved': 'Saved',
    'Submitted': 'Submitted',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Paid': 'Paid',
    "PartiallyPaid": "PartiallyPaid",
    "Pending": "Pending",
    "Cancelled": "Cancelled"
  },
  EXPENSE_ENYTY_DEFAULT_RECORD: {
    type: EMPTY_STRING, 
    billable: false,
    expenseDate: EMPTY_STRING,
    amount: EMPTY_STRING,
    notes: EMPTY_STRING,
    status: "Draft"
  },
  EXPENSE_TYPE: [
    {
      typeId: "Meals",
      typeName: "Meals",
    },
    {
      typeId: "Taxi",
      typeName: "Taxi",
    },
    {
      typeId: "Cost",
      typeName: "Cost",
    },
    {
      typeId: "Meal",
      typeName: "Meal",
    },
    {
      typeId: "Meal",
      typeName: "Meal",
    },             
  ],
  EXPENSE_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Expense",
      accessor: "name"
    },  
    {
      label: "Project",
      accessor: "projectName"
    },  
    {
      label: "Billable",
      accessor: "billable",
      format: (value) => (value ? "Yes" : 'No')
    },
    {
      label: "Amount",
      accessor: "total"
    },
    {
      label: "Paid",
      accessor: "paidAmount"
    },
    {
      label: "Approved On",
      accessor: "approvedDate"
    },    
    {
      label: "",
      accessor: "detailAction",
      disableSearch: true
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Approved"? "timesheet.approved_status": (value === "Submitted" || value === "Saved")? "timesheet.approved_status": "timesheet.pending_status"}`}>{value}</Badge>  : '✖️')
    }               
  ]


}
