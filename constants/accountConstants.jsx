import * as Yup from 'yup';


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


export const TIMESHEET_ENTRY_DEFAULT = {projectId: "", status: "", entries: {day1: {hours: "", error: false, date: "", note: ""}, day2: {hours: "", error: false, date: "", note: ""},day3: {hours: "", error: false, date: "", note: ""},day4: {hours: "", error: false, date: "", note: ""},day5: {hours: "", error: false, date: "", note: ""},day6: {hours: "", error: false, date: "", note: ""},day7: {hours: "", error: false,date: "", note: ""}}};

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
    accountPhone: Yup.string().required('Account Phone is required'),
    

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
    userRole: Yup.string().required('User Role is required'),
    userEmail: Yup.string().required('User Email is required'),
    userPhone: Yup.string().required('User Phone is required'),
    userAccountId: Yup.string().required('User Account is required'),
    userPassword: Yup.string().required('User Password is required'),
    timeSheetEnabled: Yup.string().required('TimeSheet is required'),

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
    phone: Yup.string().required('Account State is required'),
    accountId: Yup.string().required('Account ZipCode is required'),
    ein: Yup.string().required('Account Country is required'),
    status: Yup.string().required('User Role is required'),
    accountContactName: Yup.string().required('User Email is required'),
    accountContactEmail: Yup.string().required('User Phone is required'),
    accountContactPhone: Yup.string().required('User Account is required'),
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
    totalHours: Yup.string().required('User Email is required'),
    averageRate: Yup.string().required('User Phone is required'),
    status: Yup.string().required('User Phone is required'),

  });   
  
  export const USER_ROLES = [
    {
      roleID: "ACCOUNT_ADMIN",
      roleName: "Account Admin"
    },    
    {
      roleID: "ACCOUNT_VENDOR_REP",
      roleName: "Account Vendor Rep"
    },
    {
      roleID: "ACCOUNT_USER",
      roleName: "Account Regular User"
    },
    {
      roleID: "ACCOUNT_VENDOR_EMPLOYEE",
      roleName: "Vendor Employee"
    },
    {
      roleID: "ACCOUNT_VENDOR_CONTRACTOR",
      roleName: "Vendor Contractor"
    }            

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
    roleName: "Account Vendor Rep"
  },
  {
    roleID: "ACCOUNT_USER",
    roleName: "Account Regular User"
  },
  {
    roleID: "ACCOUNT_VENDOR_EMPLOYEE",
    roleName: "Vendor Employee"
  },
  {
    roleID: "ACCOUNT_VENDOR_CONTRACTOR",
    roleName: "Vendor Contractor"
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
    invoiceStatusId: "PartiallyPaid",
    invoiceStatusName: "PartiallyPaid"
  },
  {
    invoiceStatusId: "Paid",
    invoiceStatusName: "Paid"
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


export const INVOICE_PAY_TERMNS = [
  {
  paymentTermId: "Net30",
  paymentTermName: "Net30"
  },
  {
    paymentTermId: "Net45",
    paymentTermName: "Net45"
  },    
  {
    paymentTermId: "Net60",
    paymentTermName: "Net60"
  },
  {
    paymentTermId: "Net90",
    paymentTermName: "Net90"
  },
  {
    paymentTermId: "Net180",
    paymentTermName: "Net180"
  },
  {
    paymentTermId: "Net365",
    paymentTermName: "Net365"
  }            

];  


export const USER_ROLE_DESC = {
  'SUPER_ADMIN': 'Super Admin',
  'ACCOUNT_ADMIN': 'Account Admin',
  'ACCOUNT_VENDOR_REP': 'Vendor Account Rep',
  'ACCOUNT_USER': 'Account User',
  'ACCOUNT_VENDOR_EMPLOYEE': 'Vendor Employee',
  'ACCOUNT_VENDOR_CONTRACTOR': 'Vendor Contractor',
  'ACCOUNT_MANAGER': 'Account Manager'
};

export const TIMESHEET_STATUS = {
  'Draft': 'Draft',
  'Saved': 'Saved',
  'Submitted': 'Submitted',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Invoiced': 'Invoiced',
  "Pending": "Pending"
};

export const TIMESHEET_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required('First Name is required'),

});    

export const NOTES_TYPE = {
  'Timesheet': 'Timesheet',
  'Account': 'Account',
  'Invoice': 'Invoice',
  'Project': 'Project',
  'User': 'User',
  "TimesheetEntry": "TimesheetEntry"
};
