import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import {USER_ROLES} from "../constants/userConstants";
import jwtDecode from 'jwt-decode';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';

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
    getUsersByAccount,
    getProjectsByUser,
    isEmployee,
    isContractor,
    isManager,
    isTimesheetEntryUser,
    getTimesheetByUser,
    getTimesheetApprovalByUser,
    isAuthenticated,
    changePassword

};


function isAuthenticated() {
    if( userSubject.value 
        && userSubject.value.id != EMPTY_STRING
        && userSubject.value.id != undefined 
        && isUserNameValidAgainstToken()) {            
        return true;
    }
    
    return false;

}

function isUserNameValidAgainstToken() {
    const userNameValue = jwtDecode(userSubject.value.token).sub;
    console.log("userNameValue from Token::"+userNameValue)
    console.log("UserName from localstorage::"+userSubject.value.username)
    if(userSubject.value.username === userNameValue) {
        return true;
    }else {
        return false;
    }
}

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

function getTimesheetByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/timesheets?accountId='+accountId, {})
    .then(timesheets => {
        return timesheets;
    });
 }

 function getTimesheetApprovalByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/timesheets/approval?accountId='+accountId, {})
    .then(timesheets => {
        return timesheets;
    });
 }

function getProjectsByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/projects?accountId='+accountId, {})
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
        && userSubject.value.role == USER_ROLES.SUPER_ADMIN
        && userSubject.value.accountId == '0') {
        return true;
    }
    
    return false;
}

function isAccountAdmin() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_ADMIN
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isAccountUser() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_USER
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isEmployee() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isContractor() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isManager() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_MANAGER 
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}



function isAccountVendorRep() {
    if( userSubject.value 
        && userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_REP
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isRegularUser() {
    if( userSubject.value 
        && ( userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE  || userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR )
        && userSubject.value.role != '0') {
        return true;
    }
    
    return false;
}

function isTimesheetEntryUser() {
    if( userSubject.value 
        && ( userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE  || userSubject.value.role == USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR )
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

function changePassword(userId,oldPassword, newPassword) {
    return fetchWrapper.post(`${baseUrl}/account/user/`+userId+'/changepassword', { userId, oldPassword, newPassword })
        .then(user => {
            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}


