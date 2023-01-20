import {
  Badge,
} from '@chakra-ui/react'
import { util } from '../helpers/util'
import { EMPTY_STRING } from './accountConstants'
import ExpenseViewNotes from '../components/expense/approval/expenseViewNotes'
import ExpenseViewAttachment from '../components/expense/expenseViewAttachment'
import ExpenseTypeLookup from '../data/exponseType';

export const ExpenseConstants = {
  EXPENSE_ENTRY_LIST_TABLE_META:[
    {
      label: "Type",
      accessor: "type"
    },
    {
      label: "Billable",
      accessor: "billable",
      format: (value) => (value ? "Yes" : 'No')
    },    
    {
      label: "Date",
      accessor: "expenseDate",
      format: (value) => (value ? util.getFormattedDate(value) : 'N/A')
    },
    {
      label: "Amount",
      accessor: "amount"
    },
    {
      label: "Last Updated",
      accessor: 'lastUpdateDate',
      format: (value) => (value ? util.getFormattedDate(value) : 'N/A')
    },
    {
      label: "Notes",
      accessor: "notes",
      format: (value) => (value ? <ExpenseViewNotes notes={value}/> : 'N/A')
      
    },
    {
      label: "Attachments",
      accessor: 'attachments',
      format: (value) => (value && value.length>0 ? <ExpenseViewAttachment attachments={value}/> : 'N/A')
    },
  ],
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
    amount: EMPTY_STRING,
    notes: EMPTY_STRING,
    status: "Draft"
  },
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
      accessor: "total",
      format: (value) => (value ? "$ "+value  : '$ 0')
    },
    {
      label: "Paid",
      accessor: "paidAmount",
      format: (value) => (value ? "$ "+value  : '$ 0')
    },
    {
      label: "Approved/Rejected On",
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
