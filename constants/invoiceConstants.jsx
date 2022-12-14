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
  ] ,
  INVOICE_DETAIL_TO_GENERATE_FILE: {
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          address: {
            where: {
              vendorId: null,
              userId: null
            }
          }
        },
      },
      invoiceItems: {
        select: {
          description: true,
          type: true,
          unitPrice: true,
          currency: true,
          quantity: true,
          uom: true,
          total: true,
          status: true,
          userId: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          timesheetEntryId: true,
          timesheetEntry: {
            select: {
              id: true,
              status: true,
              entries: true,
              unitPrice: true
            }
          },
          fromDate: true,
          toDate: true

        }
      },
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          address: {
            where: {
              userId: null
            }
          }
        }
      },
      project: {
        select: {
          id: true,
          name: true,
          referenceCode: true
        }
      }
    }
  },
  INVOICE_LIST_TABLE_META: [
    {
      Header: "ID",
      accessor: "id"
    },
    {
      Header: "Type",
      accessor: "type"
    },    
    {
      Header: "Name",
      accessor: "vendor.name"
    },
    {
      Header: "Account",
      accessor: "account.name"
    },
    {
      Header: "Invoice Date",
      accessor: "formattedInvoiceDate",
    },
    {
      Header: "Due Date",
      accessor: "formattedDueDate"
    },
    {
      Header: "Amount",
      accessor: "amount"
    },
    {
      Header: "Paid Amount",
      accessor: "paidAmount"
    },    
    {
      Header: "",
      accessor: "detailAction"
    },
    {
      Header: "Status",
      accessor: "status"
    }
                         
  ]

}
