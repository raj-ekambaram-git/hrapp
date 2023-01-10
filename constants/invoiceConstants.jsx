export const InvoiceConstants = {
  INVOICE_ITEM_TYPE_TIMESHEET: 'Timesheet',
  INVOICE_STATUS: {
    'Draft': 'Draft',
    'Submitted': 'Submitted',
    'Pending': 'Pending',
    'Paid': 'Paid',
    'PartiallyPaid': 'PartiallyPaid',
    'Cancelled': 'Cancelled',
  },
  INVOICE_TRANSSACTION__STATUS: {
    'Pending': 'Pending',
    'Paid': 'Paid',
    'Refund': 'Refund',
    'Cancelled': 'Cancelled',
    'PartiallyPaid': 'PartiallyPaid',
  },
  INVOICE_CURRENCY_USD: 'USD',
  INVOICE_UOM_HOURS: 'Hours',
  INVOICE_TYPES: [
    {
      invoiceTypeId: "General",
      invoiceTypeName: "General"
    },
    {
      invoiceTypeId: "Staffing",
      invoiceTypeName: "Staffing"
    },
    {
      invoiceTypeId: "Project",
      invoiceTypeName: "Project"
    },
    {
      invoiceTypeId: "Timesheet",
      invoiceTypeName: "Timesheet"
    }
  ],
  INVOICE_TRAN_STATUS_LOOKUP: [
    {
      invoiceTranStatusId: "Pending",
      invoiceTranStatusName: "Pending"
    },
    {
      invoiceTranStatusId: "Paid",
      invoiceTranStatusName: "Paid"
    },
    {
      invoiceTranStatusId: "Refund",
      invoiceTranStatusName: "Refund"
    },
    {
      invoiceTranStatusId: "Cancelled",
      invoiceTranStatusName: "Cancelled"
    }
  ]  
}
