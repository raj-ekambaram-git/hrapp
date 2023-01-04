export const InvoiceConstants = {
  INVOICE_ITEM_TYPE_TIMESHEET: 'Timesheet',
  INVOICE_STATUS: {
    'Draft': 'Draft',
    'Submitted': 'Submitted',
    'Pending': 'Pending',
    'PartiallyPaid': 'PartiallyPaid',
    'Cancelled': 'Cancelled',
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
  ]
}
