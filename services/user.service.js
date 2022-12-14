import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import {UserConstants} from "../constants/userConstants";
import jwtDecode from 'jwt-decode';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();

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
    changePassword,
    resetPassword,
    getUserVendors,
    addUserVendor,
    removeUserVendor,
    getAvailableProjectsForUser

};

function getAvailableProjectsForUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/${userId}/availableprojects?accountId=`+accountId, {})
    .then(availableProjects => {
        return availableProjects;
    })  
    .catch(err => {
      console.log("Error Getting getAvailableProjectsForUser")
      return {errorMessage: err, error: true};
  });
}

function removeUserVendor (removeRequest) {
    return fetchWrapper.post(`${baseUrl}/account/user/vendor/delete`, {removeRequest})
        .then(userVendor => {
            return userVendor;
        })
        .catch(err => {
            console.log("Error removeUserVendor::"+err)
            return {errorMessage: err, error: true};
        });
}

function addUserVendor (userVendorData, accountId) {
    return fetchWrapper.post(`${baseUrl}/account/user/vendor/create`, {userVendorData})
        .then(userVendor => {
            return userVendor;
        })
        .catch(err => {
            console.log("Error addUserVendor::"+err)
            return {errorMessage: err, error: true};
        });
}


function getUserVendors (userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/${userId}/vendors?accountId=`+accountId, {})
    .then(userVendors => {
        return userVendors;
    })  
    .catch(err => {
      console.log("Error Getting getUserVendors")
      return {errorMessage: err, error: true};
  });
}
function isAuthenticated() {
    if( userSubject.value 
        && userSubject.value?.id != EMPTY_STRING
        && userSubject.value?.id != undefined 
        && isUserNameValidAgainstToken()
        && !userSubject.value?.passwordExpired) {            
        return true;
    }
    
    return false;

}

function isUserNameValidAgainstToken() {
    const userNameValue = jwtDecode(userSubject.value?.authToken).sub;
    console.log("getConfig():::"+JSON.stringify(getConfig() ))
    console.log("userNameValue::"+JSON.stringify(serverRuntimeConfig.clientId))
    if(userSubject.value?.username+"_"+userSubject.value?.accountId+"_"+serverRuntimeConfig.clientId === userNameValue) {
        return true;
    }else {
        return false;
    }
}

function isValidAccount(accountIdFromRequest) {
    if(accountIdFromRequest == userSubject.value?.accountId) {
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
        return {accountId: userSubject.value?.accountId};
    }
    return {accountId: 1};
}

function isSuperAdmin() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.SUPER_ADMIN
        && userSubject.value?.accountId == UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isAccountAdmin() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_ADMIN
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isAccountUser() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_USER
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isEmployee() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE 
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isContractor() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR 
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isManager() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_MANAGER 
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}



function isAccountVendorRep() {
    if( userSubject.value 
        && userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_REP
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isRegularUser() {
    if( userSubject.value 
        && ( userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE  || userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR )
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isTimesheetEntryUser() {
    if( userSubject.value 
        && ( userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE  || userSubject.value?.role == UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR )
        && userSubject.value?.role != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            if(!user.passwordExpired) {
                userSubject.next(user);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function changePassword(userId,oldPassword, newPassword) {
    return fetchWrapper.post(`${baseUrl}/authenticate/`+userId+'/changepassword', { userId, oldPassword, newPassword })
        .then(user => {
            return user;
        })
        .catch(err => {
            console.log("Inside errorr")
            return {errorMessage: err, error: true};
        });
}

function resetPassword(email) {
    return fetchWrapper.post(`${baseUrl}/authenticate/resetpassword`, { email })
        .then(user => {
            return user;
        })
        .catch(err => {
            return {errorMessage: err, error: true};
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
}


