import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import prisma from "../lib/prisma"; 

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    isSuperAdmin,
    isAccountAdmin,
    isRegularUser,
    isAccountUser,
    isAccountVendorRep,
    getAccountDetails,
    isValidAccount,
    getAccountsList,
    getUsersByVendor,
    getUsersByAccount
};

function isValidAccount(accountIdFromRequest) {
    if(accountIdFromRequest == userSubject.value.accountId) {
        return true
    }
    return false;
}

function getUsersByVendor(vendorId, accountId) {
   return fetchWrapper.get(`${baseUrl}/account/`+accountId+'/users?vendorId='+vendorId, {})
   .then(users => {
       return users;
   });
}

function getUsersByAccount(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/list`, {})
        .then(accounts => {
            return accounts;
        });
}

function getAccountsList() {
    return fetchWrapper.get(`${baseUrl}/account/list`, {})
        .then(accounts => {
            return accounts;
        });
}

function getAccountDetails() {
    if(userSubject.value) {
        return {accountId: userSubject.value.accountId};
    }
    return {accountId: 0};
}

function isSuperAdmin() {
    if( userSubject.value 
        && userSubject.value.role == 'SUPER_ADMIN' 
        && userSubject.value.accountId == '0') {
        return true;
    }
    
    return false;
}

function isAccountAdmin() {
    if( userSubject.value 
        && userSubject.value.role == 'ACCOUNT_ADMIN' 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isAccountUser() {
    if( userSubject.value 
        && userSubject.value.role == 'ACCOUNT_USER' 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isAccountVendorRep() {
    if( userSubject.value 
        && userSubject.value.role == 'ACCOUNT_VENDOR_REP' 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isRegularUser() {
    if( userSubject.value 
        && ( userSubject.value.role == 'ACCOUNT_VENDOR_EMPLOYEE'  || userSubject.value.role == 'ACCOUNT_VENDOR_CONTRACTOR' )
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}


