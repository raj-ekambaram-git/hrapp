import getConfig from 'next/config';
import jwtDecode from 'jwt-decode';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const access = {
    hasAccess,
};

function hasAccess(url, token) {
  
    return fetchWrapper.cachedGet(`${baseUrl}/access/roles/`, {}, 24)
    .then(async rolesData => {
        const decryptedValue = jwtDecode(token);
        const userRoles = decryptedValue['sub']?.split(":")[3];
        const userRolesArray = userRoles.split(",");
        const urlAllowed = userRolesArray?.map((role, index) => {
            console.log("url::"+url)
            console.log("rolesData[role].allowedPages?.includes(url)::"+rolesData[role].allowedPages?.includes(url))
            if(rolesData[role].allowedPages?.includes(url)){
                return true;
            }else{
                return false;
            }
        });

        console.log("urlAllowed:::"+urlAllowed.includes(true))
        return urlAllowed.includes(true);

    })
    .catch(err => {
      console.log("Error hasAccess::"+err)
      return {errorMessage: err, error: true};
    });
    
}