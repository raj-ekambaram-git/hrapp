export const WorkFlowConstants = {
    WORKFLOW_TYPE: {
        'Vendor': 'Vendor',
        'Invoice': 'Invoice',
        'Project': 'Project',
        'User': 'User',
    },
    WORKFLOW_STATUS: {
        "Active": "Active",
        "Inactive": "Inactive",
        "Draft": "Draft",

    },
    TASK_LIST_TABLE_META: [
        {
          label: "Type",
          accessor: "type"
        },    
        {
          label: "Name",
          accessor: "name"
        },
        {
          label: "Description",
          accessor: "description"
        }, 
        {
          label: "Updated By",
          accessor: "updatedBy",
        },
        {
          label: "Status",
          accessor: "status", 
          format: (value) => (value ? <Badge color={`${(value === "Paid" || value === "PartiallyPaid") ? "paid_status": value === "Pending" ? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
        }
                             
      ]

}