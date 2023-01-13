import {
  Tooltip,Badge
} from '@chakra-ui/react'

export const UserConstants = {
    SUPER_ADMIN_ID: '1',
    USER_ROLES:  { 
        SUPER_ADMIN: "SUPER_ADMIN",
        ACCOUNT_ADMIN: "ACCOUNT_ADMIN",
        ACCOUNT_VENDOR_REP: "ACCOUNT_VENDOR_REP",
        ACCOUNT_USER: "ACCOUNT_USER",
        ACCOUNT_VENDOR_EMPLOYEE: "ACCOUNT_VENDOR_EMPLOYEE",
        ACCOUNT_VENDOR_CONTRACTOR: "ACCOUNT_VENDOR_CONTRACTOR",
        ACCOUNT_MANAGER: "ACCOUNT_MANAGER",
        DEVELOPER: "DEVELOPER" 
    } ,
    USER_ACCOUNT_LIST_TABLE_META: [
        {
          label: "ID",
          accessor: "id"
        },
        {
          label: "First Name",
          accessor: "firstName"
        },    
        {
          label: "Last Name",
          accessor: "lastName"
        },
        {
          label: "User Id/Email",
          accessor: "email"
        },
        {
          label: "Role",
          accessor: 'role',
          format: (value) => (value ? <Tooltip label={value}>Roles</Tooltip> : '✖️')
        },
        {
          label: "Account",
          accessor: "accountName"
        },
        {
          label: "Vendor",
          accessor: 'vendorName'
        },
        {
          label: "Created",
          accessor: "createdDate"
        },   
        {
            label: "",
            accessor: "userAction"
        },  
        {
            label: "Status",
            accessor: "status",
            format: (value) => (value ? <Badge color={`${(value === "Active" || value === "Approved")? "paid_status" : "pending_status"}`}>{value}</Badge> : '✖️')
            
        }, 
  
      ],
    USER_VENDOR_LIST_TABLE_META: [
        {
          label: "ID",
          accessor: "id"
        },
        {
          label: "First Name",
          accessor: "firstName"
        },    
        {
          label: "Last Name",
          accessor: "lastName"
        },
        {
          label: "User Id/Email",
          accessor: "email"
        },
        {
          label: "Role",
          accessor: 'role',
          format: (value) => (value ? <Tooltip label={value}>Roles</Tooltip> : '✖️')
        },
        {
          label: "Account",
          accessor: "accountName"
        },
        {
          label: "Vendor",
          accessor: 'vendorName'
        },
        {
          label: "Created",
          accessor: "createdDate"
        },   
        {
            label: "",
            accessor: "userAction"
        },  
        {
            label: "Status",
            accessor: "status",
            format: (value) => (value ? <Badge color={`${(value === "Active" || value === "Approved")? "paid_status" : "pending_status"}`}>{value}</Badge> : '✖️')
          },     
      ]
}