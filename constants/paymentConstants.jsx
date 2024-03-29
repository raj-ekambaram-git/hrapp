import { Badge, Text } from "@chakra-ui/react";
import { util } from "../helpers";


export const PaymentConstants = {
  SUPPORTED_PAYMENT_PROCESSORS: {
    "Dwolla": "Dwolla"
  },
  TRANSACTION_LIST_TABLE_META: [
    {
      label: "",
      accessor: "open_transaction",
      disableSearch: true,
      disableSort: true
    },
    {
      label: "Amount",
      accessor: "transaction_amount",
      format: (value) => (value ? <Text fontWeight="600" color={value>0?"pending_status":"paid_status"}>{util.getWithCurrency(value>0?value:-value)}</Text> : util.getWithCurrency(0))
    },
    {
      label: "Date",
      accessor: "transaction_date",
    },    
    {
      label: "Status",
      accessor: "transaction_status",
      format: (value) => (value ? <Badge color={`${value === "Pending" ? "pending_status": "paid_status"}`}>{value}</Badge> : '✖️')
    },
    {
      label: "Category",
      accessor: "transaction_category",
      format: (value) => (value ? value.join(", ") : 'N/A')
    },
    {
      label: "",
      accessor: "transaction_action",
      disableSearch: true,
      disableSort: true
    },                         
  ],
  INVOICE_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id",      
    },
    {
      label: "Name",
      accessor: "description",
    },    
    {
      label: "Type",
      accessor: "type",
    },       
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Submitted" ? "pending_status": "paid_status"}`}>{value}</Badge> : '✖️')
    },
    {
      label: "Total",
      accessor: "total",
      format: (value) => (value ? util.getWithCurrency(value) : 'N/A')
    },
    {
      label: "Paid",
      accessor: "paidAmount",
      format: (value) => (value? <Text color={value>0?"paid_status":"pending_status"}>{util.getWithCurrency(value)}</Text> : 'N/A')
    },    
    {
      label: "Due",
      accessor: "dueDte",
      format: (value) => (value? util.getFormattedDate(value) : 'N/A')
    },   
    {
      label: "",
      accessor: "attachAction",
      disableSearch: true,
      disableSort: true
    },                         
  ],
  EXPENSE_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id",      
    },
    {
      label: "Name",
      accessor: "name",
    },    
    {
      label: "Type",
      accessor: "category",
    },       
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Submitted" ? "pending_status": "paid_status"}`}>{value}</Badge> : '✖️')
    },
    {
      label: "Total",
      accessor: "total",
      format: (value) => (value ? util.getWithCurrency(value) : 'N/A')
    },
    {
      label: "Paid",
      accessor: "paidAmount",
      format: (value) => (value? <Text color={value>0?"paid_status":"pending_status"}>{util.getWithCurrency(value)}</Text> : 'N/A')
    },    
    {
      label: "",
      accessor: "attachAction",
      disableSearch: true,
      disableSort: true
    },                         
  ],
  NEW_EXPENSE_LIST_TABLE_META: [
    {
      label: "Type",
      accessor: "type",      
    },
    {
      label: "Amount",
      accessor: "amount",
    },    
    {
      label: "Billable",
      accessor: "billable",
      format: (value) => (value ? "Yes": "No")
    },   
    {
      label: "Date",
      accessor: "expenseDate",
    },           
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Submitted" ? "pending_status": "paid_status"}`}>{value}</Badge> : '✖️')
    },
    {
      label: "Transaction ID",
      accessor: "notes",
    },                       
  ]
  
}
