import getConfig from 'next/config';
import jwtDecode from 'jwt-decode';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const access = {
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
                console.log("moduleVal::"+moduleVal)
                if(!modulesAllowed.includes(moduleVal)) {
                    modulesAllowed.push(moduleVal)
                }
            })
        });
        
        console.log("M modules Allowed:::"+modulesAllowed)
        return modulesAllowed;
    })
    .catch(err => {
      console.log("Error hasAccess::"+err)
      return {errorMessage: err, error: true};
    });
    
}

function hasAccess(url, token) {
  
    return fetchWrapper.cachedGet(`${baseUrl}/access/roles/`, {}, 24)
    .then(async rolesData => {
        const decryptedValue = jwtDecode(token);
        const userRoles = decryptedValue['sub']?.split(":")[3];
        const userRolesArray = userRoles.split(",");
        const urlAllowed = userRolesArray?.map((role, index) => {
            if(rolesData[role].allowedPages?.includes(url)){
                return true;
            }else{
                return false;
            }
        });
        return urlAllowed.includes(true);

    })
    .catch(err => {
      return {errorMessage: err, error: true};
    });
    
}