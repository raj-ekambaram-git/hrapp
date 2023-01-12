
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
      accessor: "budgetAllocated",
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
      Header: "ID",
      accessor: "id"
    },
    {
      Header: "Name",
      accessor: "name"
    },    
    {
      Header: "Type",
      accessor: "type"
    },
    {
      Header: "Budget",
      accessor: "budget"
    },
    {
      Header: "Account",
      accessor: "account.name",
    },
    {
      Header: "Vendor",
      accessor: "vendorName"
    },
    {
      Header: "Updated",
      accessor: "createdDate"
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
