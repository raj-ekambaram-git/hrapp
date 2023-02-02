import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import {UserConstants} from "../constants/userConstants";
import jwtDecode from 'jwt-decode';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';
import { Role } from '@prisma/client';
import cookie from 'js-cookie'

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return cookie.get("user")?JSON.parse(cookie.get("user")):cookie.get("user") },
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
    getAvailableProjectsForUser,
    createUser,
    updateUser,
    getExpensesByUser,
    getExpenseApprovalByUser,
    getExpensePaymentByUser,
    getApprovalData,
    getAllAccountCosts
};

function getAllAccountCosts(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/cost?accountId='+accountId, {})
    .then(costs => {
        return costs;
    });
 }
 

function getApprovalData(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/approval?accountId='+accountId, {})
    .then(approvalData => {
        return approvalData;
    });
}

function getExpensePaymentByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/expenses/payment?accountId='+accountId, {})
    .then(expenses => {
        return expenses;
    });
 }
 
function getExpenseApprovalByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/expenses/approval?accountId='+accountId, {})
    .then(expenses => {
        return expenses;
    });
 }

function getExpensesByUser(userId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/expenses?accountId='+accountId, {})
    .then(expenses => {
        return expenses;
    })
    .catch(err => {
        console.log("Error getting expenses::"+err)
        return {errorMessage: err, error: true};
    });
 }

function updateUser(userId, formData, addressId, userRole) {
    console.log("FORM DATA::"+JSON.stringify(formData)+"******Address ID::"+addressId+"-----")
    return fetchWrapper.put(`${baseUrl}/account/user/`+userId, {
        id: parseInt(userId),
        firstName: formData.firstName,
        lastName: formData.lastName,
        type: formData.userType,
        address: addressId&&addressId!=EMPTY_STRING?{
          update: {
            where: {
              id: addressId,
            },
            data:
            {
              type: "U",
              addressName: formData.addressName,
              address1: formData.address1,
              address2: formData.address2,
              address3: formData.address3,
              accountId: parseInt(formData.userAccountId),
              vendorId: parseInt(formData.userVendorId),
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
                type: "U",
                addressName: formData.addressName,
                address1: formData.address1,
                address2: formData.address2,
                address3: formData.address3,
                accountId: parseInt(formData.userAccountId),
                vendorId: parseInt(formData.userVendorId),
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                status: "A"
                }
            ]
        },
        userRole: userRole,  
        email: formData.userEmail.toLowerCase(),
        password: formData.userPassword,
        phone: formData.userPhone,
        cost: formData.cost,
        accountId: parseInt(formData.userAccountId),
        // vendorId: parseInt(formData.userVendorId),
        isTimeSheetEnabled: formData.timeSheetEnabled == "true" ? true : false,
        status: formData.userStatus
      }
  )
  .then(user => {
    return user;
  })
  .catch(err => {
    console.log("Error Updating User::"+err)
    return {errorMessage: err, error: true};
   });
}

function createUser(formData, userRoles) {
    return fetchWrapper.post(`${baseUrl}/account/user/create`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        type: formData.userType,
        address: {
          create: [
            {
              type: "U",
              addressName: formData.addressName,
              address1: formData.address1,
              address2: formData.address2,
              address3: formData.address3,
              accountId: parseInt(formData.userAccountId),
              vendorId: parseInt(formData.userVendorId),
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
              status: "A"
            }
          ]
        },
        userRole: userRoles,
        email: formData.userEmail.toLowerCase(),
        password: formData.userPassword,
        phone: formData.userPhone,
        cost: formData.cost,
        accountId: parseInt(formData.userAccountId),
        // vendorId: parseInt(formData.userVendorId),
        isTimeSheetEnabled: formData.timeSheetEnabled == "true" ? true : false,
        status: formData.userStatus,
        password: "defaultPassword"
        }
    )
    .then(async user => {
  
        return user;
    })        
    .catch(err => {
      console.log("Error Creating User"+err)
      return {errorMessage: err, error: true};
    });
  }

  
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

function getProjectsByUser(userId, accountId, filter) {
    return fetchWrapper.get(`${baseUrl}/account/user/`+userId+'/projects?accountId='+accountId+"&filter="+filter, {})
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
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.SUPER_ADMIN)
        && userSubject.value?.accountId == UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isAccountAdmin() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_ADMIN)
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isAccountUser() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_USER)
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isEmployee() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE)
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isContractor() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR)
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isManager() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_MANAGER)
        && (userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID || userSubject.value?.accountId != UserConstants.ACCOUNT_ADMIN)) {
        return true;
    }
    
    return false;
}



function isAccountVendorRep() {
    if( userSubject.value 
        && userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_REP)
        && (userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID || userSubject.value?.accountId != UserConstants.ACCOUNT_ADMIN)) {
        return true;
    }
    
    return false;
}

function isRegularUser() {
    if( userSubject.value 
        && ( userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE)  || userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR) )
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
        return true;
    }
    
    return false;
}

function isTimesheetEntryUser() {
    if( userSubject.value 
        && ( userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_EMPLOYEE)  ||  userSubject.value?.userRole?.includes(UserConstants.USER_ROLES.ACCOUNT_VENDOR_CONTRACTOR) )
        && userSubject.value?.accountId != UserConstants.SUPER_ADMIN_ID) {
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
                cookie.set('user', JSON.stringify(user), { expires: 1 })
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
    cookie.remove("user")
    userSubject.next(null);
}


