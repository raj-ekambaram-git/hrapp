import {
  Badge,
} from '@chakra-ui/react'

export const VendorConstants = {

  VENDOR_LIST_TABLE_META: [
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
      label: "Contact Email",
      accessor: "email"
    },
    {
      label: "Contact Phone",
      accessor: "phone",
    },
    {
      label: "EIN",
      accessor: "ein"
    },
    {
      label: "Updated",
      accessor: "createdDate"
    },
    {
      label: "",
      accessor: "detailAction"
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Active" ? "paid_status": value === "Inactive"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
      
    }
                         
  ]

}
