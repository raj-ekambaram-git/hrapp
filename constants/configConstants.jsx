import AddEditConfigAdmin from "../components/configuration/addEditConfigAdmin";
import {
  Badge,
} from '@chakra-ui/react'
import { util } from '../helpers/util'
import { ExportTemplateStatus, ExportTemplateType } from "@prisma/client";

export const ConfigConstants = {

  AVAILABLE_PAYMENT_PROCESSORS: [
    {
      processorId: "Dwolla",
      processorName: "Dwolla",
    },  
  ],
  AVAILABLE_PAYMENT_ACCOUNT_TYPES: [
    {
      id: "Checking",
      name: "Checking",
    },  
    {
      id: "Savings",
      name: "Savings",
    },  
  ],  
  FEATURES: {
    ESIGNATURE: "eSignature",
    WORK_FLOW: "WorkfFlow",
    SCHEDULE_JOB: "ScheduleJob",
    PAYMENT: "Payment",
    PAYMENT_PROCESSOR: "PaymentProcessor",
  },
  AVAILABLE_REPORTS: {
    ProjectReport: "ProjectReport",
    VendorReport: "VendorReport",
    AccountReport: "AccountReport"
  },
  CONFIG_KEYS: {
    AllowedImports: "allowedImports",
    AllowedExports: "allowedExports"
  },
  CONFOG_APP_ADMIN_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id",
      format: (value) => (value ? <><AddEditConfigAdmin isAddMode={false} appConfigId={value}/> {value}</> : 'N/A')
    },
    {
      label: "Name",
      accessor: "name"
    },    
    {
      label: "Key",
      accessor: "key"
    },
    {
      label: "Value",
      accessor: "value",
      format: (value) => value.map((value) => <p>{value.toString()}</p>)
    },
    {
      label: "On",
      accessor: "lastUpdateDate",
      format: (value) => (value ? util.getFormattedDate(value) : 'N/A')
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

  ],
  EXPORT_TEMPLATE_LIST_META: [
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
        accessor: "type",
        format: (value) => (value ? <Badge color={value==ExportTemplateType.User?"paid_status":"pending_status"}>{value}</Badge> : 'N/A')
      },      
      {
        label: "File Prefix",
        accessor: "fileName"
      },      
      {
        label: "File Type",
        accessor: "fileType"
      },
      {
        label: "Status",
        accessor: "status",
        format: (value) => (value ? <Badge color={value==ExportTemplateStatus.Active?"paid_status":"pending_status"}>{value}</Badge> : 'N/A')
        
      },
      {
        label: "",
        accessor: 'exportAction',
        disableSearch: true,
        disableSort: true
      },
     
    ]

}
