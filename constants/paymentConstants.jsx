import { Badge, Text } from "@chakra-ui/react";
import { util } from "../helpers";

export const PaymentConstants = {
  SUPPORTED_PAYMENT_PROCESSORS: {
    "Dwolla": "Dwolla"
  },
  TRANSACTION_LIST_TABLE_META: [
    {
      label: "Amount",
      accessor: "transaction_amount",
      format: (value) => (value ? <Text fontWeight="600" color={value>0?"pending_status":"paid_status"}>{util.getWithCurrency(value)}</Text> : util.getWithCurrency(0))
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
  ]
}
