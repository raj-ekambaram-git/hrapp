import * as Yup from 'yup';


export const POST_METHOD = 'POST';

//Common Constants
export const EMPTY_STRING = '';


//Accounts Contstants
export const MODE_ADD = 'add';
export const MODE_EDIT = 'edit';


//Account Form Validation
export const ACCOUNT_VALIDATION_SCHEMA = Yup.object().shape({
    accountName: Yup.string().required('Account Name is required'),
    accountDescription: Yup.string().required('Account Description is required'),
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
    address1: Yup.string().required('Account Address1 is required'),
    city: Yup.string().required('Account City is required'),
    state: Yup.string().required('Account State is required'),
    zipCode: Yup.string().required('Account ZipCode is required'),
    country: Yup.string().required('Account Country is required'),

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
  'ACCOUNT_VENDOR_CONTRACTOR': 'Vendor Contractor'
};