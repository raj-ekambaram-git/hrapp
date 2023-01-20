import {
  Badge,
} from '@chakra-ui/react'

export const ConfigConstants = {

  CONFOG_ADMIN_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Name",
      accessor: "name"
    },    
    {
      label: "Display Name",
      accessor: "displayName"
    },
    {
      label: "Type",
      accessor: "type"
    },
    {
      label: "Values",
      accessor: "value",
    },
    {
      label: "Input Type",
      accessor: "configInputType"
    },
    {
      label: "By",
      accessor: "updatedUser"
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
  CONFIG_LOOKUP_TYPE: [
    {
      typeId: "App",
      typeName: "App"
    },
    {
      typeId: "Account",
      typeName: "Account"
    },
    {
      typeId: "User",
      typeName: "User"
    },
  ],
  CONFIG_LOOKUP_STATUS: [
    {
      statusId: "Active",
      statusName: "Active"
    },
    {
      statusId: "Inactive",
      statusName: "Inactive"
    },
    {
      statusId: "MarkForDelete",
      statusName: "Delete"
    },
  ],
  CONFIG_LOOKUP_INPUT_TYPE: [
    {
      inputTypeId: "TextBox",
      inputTypeName: "TextBox"
    },
    {
      inputTypeId: "Toggle",
      inputTypeName: "Toggle"
    },
    {
      inputTypeId: "DropDown",
      inputTypeName: "DropDown"
    },
    {
      inputTypeId: "Checkbox",
      inputTypeName: "Checkbox"
    },
    {
      inputTypeId: "CheckboxMultiSelect",
      inputTypeName: "Checkbox Multi Select"
    },

  ]

}
