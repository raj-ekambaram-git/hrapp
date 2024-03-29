import * as Yup from 'yup';
import {
  Badge,
} from '@chakra-ui/react'
import { ExpenseStatus } from '@prisma/client';

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


export const POST_METHOD = 'POST';

//Common Constants
export const EMPTY_STRING = '';


//Accounts Contstants
export const MODE_ADD = 'add';
export const MODE_EDIT = 'edit';

export const PROJECT_TYPE_GENERAL = 'General';
export const PROJECT_TYPE_PROJECT = 'Project';
export const PROJECT_TYPE_STAFFING = 'Staffing';
export const DEFAULT_NOTES = 'DEFAULT NOTES';
export const PROJECT_CALL_TYPE = 'PROJECT';
export const INVOICE_CALL_TYPE = 'INVOICE';
export const COST_CALL_TYPE = 'COST';
export const EXPENSE_CALL_TYPE = 'EXPENSE';



export const TIMESHEET_ENTRY_DEFAULT = {projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false,date: "", note: ""}}};

//Request Demo
export const REQUEST_DEMO_VALIDATION_SCHEMA = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().required('Email is required'),
  phone: Yup.string()
                  .matches(phoneRegExp, "Phone number is not valid")
                  .required('Phone number is not valid'),
  companyName: Yup.string().required('Company Name is required'),
});

//Register
export const REGISTRATION_VALIDATION_SCHEMA = Yup.object().shape({
  accountName: Yup.string().required('Account Name is required'),
  accountDescription: Yup.string().required('Account Description is required'),
  // addressName: Yup.string().required('Account Name is required'),
  // address1: Yup.string().required('Account Address1 is required'),
  // city: Yup.string().required('Account City is required'),
  // state: Yup.string().required('Account State is required'),
  // zipCode: Yup.string().required('Account ZipCode is required'),
  // country: Yup.string().required('Account Country is required'),
  accountEmail: Yup.string().required('Account Email is required'),
  // accountPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  accountPhone: Yup.string()
                  .matches(phoneRegExp, "Phone number is not valid")
                  .required('Phone number is not valid'),
  userPassword: Yup.string().required('User Password is required'),
  userConfirmPassword: Yup.string().required('User Password is required'),  
  accountUserLastName: Yup.string().required('Last Name is required'),  
  accountUserFirstName: Yup.string().required('First Name is required'),  
  
  
});

//Account Form Validation
export const ACCOUNT_VALIDATION_SCHEMA = Yup.object().shape({
    accountName: Yup.string().required('Account Name is required'),
    accountDescription: Yup.string().required('Account Description is required'),
    addressName: Yup.string().required('Account Name is required'),
    address1: Yup.string().required('Account Address1 is required'),
    city: Yup.string().required('Account City is required'),
    state: Yup.string().required('Account State is required'),
    zipCode: Yup.string().required('Account ZipCode is required'),
    country: Yup.string().required('Account Country is required'),
    accountEIN: Yup.string().required('Account EIN is required'),
    accountEmail: Yup.string().required('Account Email is required'),
    accountPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    

  });

  //User Form Validation
  export const USER_VALIDATION_SCHEMA = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    addressName: Yup.string().required('Account Name is required'),
    address1: Yup.string().required('Account Address1 is required'),
    city: Yup.string().required('Account City is required'),
    state: Yup.string().required('Account State is required'),
    zipCode: Yup.string().required('Account ZipCode is required'),
    country: Yup.string().required('Account Country is required'),
    userEmail: Yup.string().required('User Email is required'),
    // userPhone: Yup.string()
    //             .matches(phoneRegExp, "Phone number is not valid")
    //             .required('Phone number is not valid'),
    userAccountId: Yup.string().required('User Account is required'),
    // userPassword: Yup.string().required('User Password is required'),
    timeSheetEnabled: Yup.string().required('TimeSheet is required'),
    userType: Yup.string().required('Type is required'),

  });  

  export const INVOICE_VALIDATION_SCHEMA = Yup.object().shape({
    description: Yup.string().required('First Name is required'),
    type: Yup.string().required('Last Name is required'),
    vendorId: Yup.string().required('Account Address1 is required'),
    accountId: Yup.string().required('Account City is required'),
    projectId: Yup.string().required('Account State is required'),
    total: Yup.string().required('Account ZipCode is required'),
    status: Yup.string().required('User Role is required'),
    paymentTerms: Yup.string().required('User Email is required'),

  });  

  export const VENDOR_VALIDATION_SCHEMA = Yup.object().shape({
    name: Yup.string().required('First Name is required'),
    description: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Account Address1 is required'),
    type: Yup.string().required('Account City is required'),
    // phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    accountId: Yup.string().required('Account ZipCode is required'),
    ein: Yup.string().required('Account Country is required'),
    status: Yup.string().required('User Role is required'),
    accountContactName: Yup.string().required('User Email is required'),
    accountContactEmail: Yup.string().required('User Phone is required'),
    // accountContactPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    addressName: Yup.string().required('Account Name is required'),
    address1: Yup.string().required('Account Address1 is required'),
    city: Yup.string().required('Account City is required'),
    state: Yup.string().required('Account State is required'),
    zipCode: Yup.string().required('Account ZipCode is required'),
    country: Yup.string().required('Account Country is required'),

  });    

  export const PROJECT_VALIDATION_SCHEMA = Yup.object().shape({
    name: Yup.string().required('First Name is required'),
    referenceCode: Yup.string().required('First Name is required'),
    type: Yup.string().required('Account Address1 is required'),
    invoiceCycle: Yup.string().required('Account City is required'),
    addressId: Yup.string().required('Account State is required'),
    vendorId: Yup.string().required('Account ZipCode is required'),
    accountId: Yup.string().required('Account Country is required'),
    budget: Yup.string().required('User Role is required'),
    status: Yup.string().required('User Phone is required'),
    

  });   
  
  export const USER_ROLES_LOOKUP = [
    {
      roleID: "ACCOUNT_ADMIN",
      roleName: "Account Admin"
    },    
    {
      roleID: "ACCOUNT_VENDOR_REP",
      roleName: "Account Client Rep"
    },
    {
      roleID: "ACCOUNT_USER",
      roleName: "Account Regular User"
    },
    {
      roleID: "ACCOUNT_VENDOR_EMPLOYEE",
      roleName: "Employee"
    },
    {
      roleID: "ACCOUNT_VENDOR_CONTRACTOR",
      roleName: "Client Contractor"
    },
    {
      roleID: "ACCOUNT_MANAGER",
      roleName: "Account Manager"
    },
    {
      roleID: "WORKFLOW_ADMIN",
      roleName: "WorkFlow Admin"
    },
    {
      roleID: "WORKFLOW_CONTRIBUTOR",
      roleName: "WorkFlow Contributor"
    },                 
    {
      roleID: "SCHEDULE_JOB_ADMIN",
      roleName: "Schedule Job Admin"
    },     
    {
      roleID: "PAYMENT_ADMIN",
      roleName: "Payment Admin"
    },         
];  


  
export const USER_ROLES_SUPERADMIN = [
  {
  roleID: "SUPER_ADMIN",
  roleName: "Super Admin"
  },
  {
    roleID: "ACCOUNT_ADMIN",
    roleName: "Account Admin"
  },    
  {
    roleID: "ACCOUNT_VENDOR_REP",
    roleName: "Account Client Rep"
  },
  {
    roleID: "ACCOUNT_USER",
    roleName: "Account Regular User"
  },
  {
    roleID: "ACCOUNT_VENDOR_EMPLOYEE",
    roleName: "Employee"
  },
  {
    roleID: "ACCOUNT_VENDOR_CONTRACTOR",
    roleName: "Client Contractor"
  },
  {
    roleID: "ACCOUNT_MANAGER",
    roleName: "Account Manager"
  }               

];  






export const INVOICE_STATUS = [
  {
    invoiceStatusId: "Draft",
    invoiceStatusName: "Draft"
  },
  {
    invoiceStatusId: "Submitted",
    invoiceStatusName: "Submitted"
  },    
  {
    invoiceStatusId: "Pending",
    invoiceStatusName: "Pending"
  },
  {
    invoiceStatusId: "Cancelled",
    invoiceStatusName: "Cancelled"
  }      

];  

export const PROJECT_STATUS = [
  {
    projectStatusId: "Created",
    projectStatusName: "Created"
  },
  {
    projectStatusId: "Open",
    projectStatusName: "Open"
  },    
  {
    projectStatusId: "Closed",
    projectStatusName: "Closed"
  },
  {
    projectStatusId: "Settled",
    projectStatusName: "Settled"
  }    

];  


export const PROJECT_TYPES = [
  {
    projectTypeId: "General",
    projectTypeName: "General"
  },
  {
    projectTypeId: "Staffing",
    projectTypeName: "Staffing"
  },
  {
    projectTypeId: "Project",
    projectTypeName: "Project"
  },
  {
    projectTypeId: "Product",
    projectTypeName: "Product"
  },
  {
    projectTypeId: "Services",
    projectTypeName: "Services"
  }
];  


export const INVOICE_CYCLE = [
  {
  cycleId: "Weekly",
  cycleName: "Weekly"
  },
  {
    cycleId: "BiWeekly",
    cycleName: "BiWeekly"
  },    
  {
    cycleId: "Monthly",
    cycleName: "Monthly"
  },
  {
    cycleId: "Quarterly",
    cycleName: "Quarterly"
  },
  {
    cycleId: "HalfYearly",
    cycleName: "Half Yearly"
  },
  {
    cycleId: "Yearly",
    cycleName: "Yearly"
  }            

];  


export const INVOICE_PAY_TERMS = [
{
  paymentTermId: "Net7",
  paymentTermName: "Net7",
  paymentDays: 7
  },
{
  paymentTermId: "Net15",
  paymentTermName: "Net15",
  paymentDays: 15
  },
      
  {
  paymentTermId: "Net30",
  paymentTermName: "Net30",
  paymentDays: 30
  },
  {
    paymentTermId: "Net45",
    paymentTermName: "Net45",
    paymentDays: 45
  },    
  {
    paymentTermId: "Net60",
    paymentTermName: "Net60",
    paymentDays: 60
  },
  {
    paymentTermId: "Net90",
    paymentTermName: "Net90",
    paymentDays: 90
  },
  {
    paymentTermId: "Net180",
    paymentTermName: "Net180",
    paymentDays: 180
  },
  {
    paymentTermId: "Net365",
    paymentTermName: "Net365",
    paymentDays: 365
  }            

];  


export const USER_ROLE_DESC = {
  'SUPER_ADMIN': 'Super Admin',
  'ACCOUNT_ADMIN': 'Account Admin',
  'ACCOUNT_VENDOR_REP': 'Vendor Account Rep',
  'ACCOUNT_USER': 'Account User',
  'ACCOUNT_VENDOR_EMPLOYEE': 'Vendor Employee',
  'ACCOUNT_VENDOR_CONTRACTOR': 'Client Contractor',
  'ACCOUNT_MANAGER': 'Account Manager'
};

export const TIMESHEET_STATUS = {
  'Draft': 'Draft',
  'Saved': 'Saved',
  'Submitted': 'Submitted',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Invoiced': 'Invoiced',
  "Pending": "Pending",
  "PartiallyInvoiced": "PartiallyInvoiced"
};

export const EXPENSE_STATUS = {
  'Draft': 'Draft',
  'Saved': 'Saved',
  'Submitted': 'Submitted',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Invoiced': 'Invoiced',
  "Pending": "Pending",
  "Paid": "Paid"
};

export const TIMESHEET_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
});    

export const AccountConstants = {
  COST_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Name",
      accessor: "name"
    },    
    {
      label: "Project",
      accessor: "projectName"
    },    
    {
      label: "Client",
      accessor: "vendorName"
    },        
    {
      label: "Resource",
      accessor: "resource"
    },
    {
      label: "Amount",
      accessor: "amount"
    },
    {
      label: "Paid",
      accessor: "paidAmount"
    },
    {
      label: "Balance",
      accessor: "balance"
    },    
    {
      label: "Created Date",
      accessor: "createdDate"
    },    
    {
      label: "Update Date",
      accessor: "lastUpdateDate"
    },        
    {
      label: "",
      accessor: "detailAction",
      disableSearch: true,
      disableSort: true
    },
    {
      label: "",
      accessor: "payAction",
      disableSearch: true,
      disableSort: true
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${(value === ExpenseStatus.Submitted || value === ExpenseStatus.Approved || value === ExpenseStatus.Invoiced || value === ExpenseStatus.Paid || value === ExpenseStatus.PartiallyPaid)? "paid_status": "pending_status"}`}>{value}</Badge> : '✖️')
    }               
  ],
  ACCOUNT_LIST_TABLE_META: [
    {
      label: "ID",
      accessor: "id"
    },
    {
      label: "Name",
      accessor: "name"
    },    
    {
      label: "Email",
      accessor: "email"
    },
    {
      label: "EIN",
      accessor: "ein"
    },
    {
      label: "Created Date",
      accessor: "createdDate"
    },    
    {
      label: "Update Date",
      accessor: "lastUpdateDate"
    },        
    {
      label: "",
      accessor: "detailAction",
      disableSearch: true
    },
    {
      label: "Status",
      accessor: "status",
      format: (value) => (value ? <Badge color={`${value === "Active"? "paid_status": value === "Inactive"? "pending_status": "pending_status"}`}>{value}</Badge> : '✖️')
    }               
  ],
  BREADCRUMB_DATA_DETAIL_VENDOR: [
    {
      link: "/account/dashboard",
      name: "Home"
    },
    {
      link: "/account/vendors",
      name: "Clients"
    },   
    {
      link: "#",
      name: "Client Detail"
    },  
  ],
  BREADCRUMB_DATA_ADD_EDIT_VENDOR: [
    {
      link: "/account/dashboard",
      name: "Home"
    },
    {
      link: "/account/vendors",
      name: "Clients"
    },   
    {
      link: "#",
      name: "Add / Edit"
    },  
  ],
  BREADCRUMB_DATA_ADD_EDIT_TIMESHEET: [
    {
      link: "/account/dashboard",
      name: "Home"
    },
    {
      link: "/account/user/timesheets",
      name: "Timesheets"
    },   
    {
      link: "#",
      name: "Add / Edit"
    },  
  ]
  
}
