import {
  Badge,
} from '@chakra-ui/react'
import { util } from '../helpers'

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
      accessor: "detailAction",
      disableSearch: true
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Active" ? "paid_status": value === "Inactive"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
      
    }
                         
  ],
  VENDOR_PREFERENCES_TABLE_META: [
    {
      label: "",
      accessor: "deleteAction",
      disableSearch: true,
      disableSort: true
    },
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Name",
      accessor: "displayName"
    },    
    {
      label: "Key",
      accessor: "key"
    },
    {
      label: "Value",
      accessor: "value"
    },
    {
      label: "Updated On",
      accessor: "lastUpdateDate",
      format: (value) => (value ? util.getFormattedDateWithTime(value) : '✖️')
    },  
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Active" ? "paid_status": value === "Inactive"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')      
    },
    {
      label: "",
      accessor: "updateAction",
      disableSearch: true,
      disableSort: true
    },

    
                         
  ]

}
