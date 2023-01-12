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
          Header: "ID",
          accessor: "id"
        },
        {
          Header: "First Name",
          accessor: "firstName"
        },    
        {
          Header: "Last Name",
          accessor: "lastName"
        },
        {
          Header: "User Id/Email",
          accessor: "email"
        },
        {
          Header: "Role",
          accessor: 'role',
        },
        {
          Header: "Account",
          accessor: "account.name"
        },
        {
          Header: "Vendor",
          accessor: 'vendorName'
        },
        {
          Header: "Created",
          accessor: "createdDate"
        },   
        {
            Header: "",
            accessor: "userAction"
        },  
        {
            Header: "Status",
            accessor: "status"
        }, 
  
      ],
    USER_VENDOR_LIST_TABLE_META: [
        {
          Header: "ID",
          accessor: "user.id"
        },
        {
          Header: "First Name",
          accessor: "user.firstName"
        },    
        {
          Header: "Last Name",
          accessor: "user.lastName"
        },
        {
          Header: "User Id/Email",
          accessor: "user.email"
        },
        {
          Header: "Role",
          accessor: 'user.role',
        },
        {
          Header: "Account",
          accessor: "vendor.account.name"
        },
        {
          Header: "Vendor",
          accessor: 'user.vendorName'
        },
        {
          Header: "Created",
          accessor: "user.createdDate"
        },   
        {
            Header: "",
            accessor: "user.userAction"
        },  
        {
            Header: "Status",
            accessor: "user.status"
          },     
      ]
}