import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { userService } from './user.service';
import { AccountStatus, Role, UserStatus, UserType } from '@prisma/client';
import { EMPTY_STRING } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const accountService = {
    accountsList,
    accountDetail,
    userDetails,
    getVendorList,
    getInvoiceListByVendor,
    getInvoiceListByProject,
    getInvoiceListByAccount,
    getProjectList,
    getVendorDetail,
    getInvoiceDetail,
    getProjectDetail,
    getAddressByVendor,
    getProjectsByVendor,
    getUserList,
    createAccount,
    updateAccount,
    getAccountReportData,
    getCashFlowData,
    getInvoiceReportData,
    registerAccount
};

function getInvoiceReportData(accountId) {
    return fetchWrapper.get(`${baseUrl}/reports/account/`+accountId+'/invoice', {})
    .then(accountCashFlowData => {
        return accountCashFlowData;
    })
    .catch(err => {
        console.log("Error getting getCashFlowData  ::"+err)
        return {errorMessage: err, error: true};
       });
}

function getCashFlowData(accountId) {
    return fetchWrapper.get(`${baseUrl}/reports/account/`+accountId+'/cashflow', {})
    .then(accountCashFlowData => {
        return accountCashFlowData;
    })
    .catch(err => {
        console.log("Error getting getCashFlowData  ::"+err)
        return {errorMessage: err, error: true};
       });
}

function getAccountReportData(accountId) {
    return fetchWrapper.get(`${baseUrl}/reports/account/`+accountId+'/detail', {})
    .then(accountData => {
        return accountData;
    })
    .catch(err => {
        console.log("Error getting getAccountReportData  ::"+err)
        return {errorMessage: err, error: true};
       });
  }

function updateAccount(accountId, formData, addressId) {

    return fetchWrapper.put(`${baseUrl}/account/`+accountId, {
        id: parseInt(accountId),
        name: formData.accountName,
        description: formData.accountDescription,
        ein: formData.accountEIN,
        email: formData.accountEmail,
        status: formData.accountStatus,
        type: formData.accountType,
        phone: formData.accountPhone,
        updatedById: userService.userValue.id,
        address: addressId&&addressId!=EMPTY_STRING?{
          update: {
            where: {
              id: addressId,
            },
            data:
            {
              addressName: formData.addressName,
              address1: formData.address1,
              address2: formData.address2,
              address3: formData.address3,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
              status: "A"
            }
          }          
        }:{
            create: [
                {
                type: "A",
                primary: true,
                addressName: formData.addressName,
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                status: "A"
                }
            ]
        }
      }
  )
  .then(project => {
    return project;
  })
  .catch(err => {
    console.log("Error Updating Project::"+err)
    return {errorMessage: err, error: true};
   });
}

function registerAccount(formData) {
    return fetchWrapper.post(`${baseUrl}/authenticate/register`, {
            name: formData.accountName,
            description: formData.accountDescription,
            user: {
                create: [
                    {
                        firstName: formData.accountUserFirstName,
                        lastName: formData.accountUserLastName,
                        email: formData.accountEmail,
                        type: UserType.Employee,
                        userRole: [Role.ACCOUNT_ADMIN],
                        password: formData.userPassword,
                        phone: formData.accountPhone,
                        cost: "99",
                        password: formData.password,
                        status: UserStatus.Approved,
                    }
                ]
            },            
            ein: formData.accountEIN?formData.accountEIN:null,
            email: formData.accountEmail,
            status: AccountStatus.Approved,
            phone: formData.accountPhone
        }
    )
    .then(async account => {
  
        return account;
    })        
    .catch(err => {
      console.log("Error Creating Acount"+err)
      return {errorMessage: err, error: true};
    });
  }

  function createAccount(formData) {
    return fetchWrapper.post(`${baseUrl}/account/create`, {
            name: formData.accountName,
            description: formData.accountDescription,
            address: {
            create: [
                {
                type: "A",
                primary: true,
                addressName: formData.addressName,
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                status: "A"
                }
            ]
            },
            ein: formData.accountEIN,
            email: formData.accountEmail,
            status: formData.accountStatus,
            type: formData.accountType,
            phone: formData.accountPhone,
            updatedById: userService.userValue.id,
        }
    )
    .then(async project => {
  
        return project;
    })        
    .catch(err => {
      console.log("Error Creating Project"+err)
      return {errorMessage: err, error: true};
    });
  }

function getUserList(accountId) {
    console.log("getUserList:::"+accountId)
    return fetchWrapper.get(`${baseUrl}/account/`+accountId+'/users', {})
        .then(accountUsers => {
            return accountUsers;
        });
}


function getProjectsByVendor(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/`+vendorId+'/projects?accountId='+accountId, {})
        .then(projects => {
            return projects;
        });
}

function getAddressByVendor(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/`+vendorId+'/address?accountId='+accountId, {})
        .then(address => {
            return address;
        });
}


function getVendorList(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/vendors`, {})
        .then(accounts => {
            return accounts;
        });
}

function accountsList() {
    return fetchWrapper.get(`${baseUrl}/account/list`, {})
        .then(accounts => {
            return accounts;
        });
}

function getProjectList(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/projects?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getInvoiceListByAccount(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/invoices`, {})
        .then(invoices => {
            return invoices;
        });
}

function getInvoiceListByVendor(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/invoices?accountId=`+accountId, {})
        .then(invoices => {
            return invoices;
        });
}

function getInvoiceListByProject(projectId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/project/${projectId}/invoices?accountId=`+accountId, {})
        .then(invoices => {
            return invoices;
        });
}

function getProjectDetail(projectId, accountId) {
    console.log("ssseese")
    return fetchWrapper.get(`${baseUrl}/account/project/${projectId}/detail?accountId=`+accountId, {})
        .then(project => {
            console.log("project::::"+JSON.stringify(project))
            return project;
        });
}

function getInvoiceDetail(invoiceId, accountId) {
    console.log("Invoice ID::"+invoiceId+"===Accoint ID::"+accountId)
    return fetchWrapper.get(`${baseUrl}/account/invoice/${invoiceId}/detail?accountId=`+accountId, {})
        .then(invoice => {
            return invoice;
        });
}


function getVendorDetail(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/detail?accountId=`+accountId, {})
        .then(vendor => {
            console.log("getVendorDetail:::"+JSON.stringify(vendor))
            return vendor;
        });
}

function accountDetail(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/detail`, {})
        .then(account => {
            return account;
        });
}

function userDetails(userId) {
    return fetchWrapper.get(`${baseUrl}/account/user/${userId}/detail`, {})
        .then(user => {
            return user;
        });
}

