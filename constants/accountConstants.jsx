import * as Yup from 'yup';


export const POST_METHOD = 'POST';

//Common Constants
export const EMPTY_STRING = '';


//Accounts Contstants
export const MODE_ADD = 'add';
export const MODE_EDIT = 'edit';


//Validation
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