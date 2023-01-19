import getConfig from 'next/config';
import jwtDecode from 'jwt-decode';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const roleAccess = {
    hasAccess,
    getAllowedModules
};


function getAllowedModules(token) {
  
    return fetchWrapper.cachedGet(`${baseUrl}/access/roles/`, {}, 24)
    .then(async rolesData => {
        const decryptedValue = jwtDecode(token);
        const userRoles = decryptedValue['sub']?.split(":")[3];
        const userRolesArray = userRoles.split(",");
        const modulesAllowed = [];
        userRolesArray?.map((role, index) => {
            // modulesAllowed.push(rolesData[role].allowedModules)
            rolesData[role]?.allowedModules?.map((moduleVal) => {
                if(!modulesAllowed.includes(moduleVal)) {
                    modulesAllowed.push(moduleVal)
                }
            })
        });
        return modulesAllowed;
    })
    .catch(err => {
      return {errorMessage: err, error: true};
    });
    
}

function hasAccess(url, token) {
    url = url.split("?")
    return fetchWrapper.cachedGet(`${baseUrl}/access/roles/`, {}, 24)
    .then(async rolesData => {
        const decryptedValue = jwtDecode(token);
        const userRoles = decryptedValue['sub']?.split(":")[3];
        const userRolesArray = userRoles.split(",");
        const modulesAllowed = [];
        const urlAllowed = userRolesArray?.map((role, index) => {
            rolesData[role]?.allowedModules?.map((moduleVal) => {
                if(!modulesAllowed.includes(moduleVal)) {
                    modulesAllowed.push(moduleVal)
                }
            })
            if(rolesData[role].allowedPages?.includes(url[0])){
                return true;
            }else{
                return false;
            }
        });
        return {hasAccess: urlAllowed.includes(true), modulesAllowed: modulesAllowed};

    })
    .catch(err => {
      return {errorMessage: err, error: true};
    });
    
}