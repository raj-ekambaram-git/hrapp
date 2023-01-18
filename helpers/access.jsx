import jwtDecode from 'jwt-decode';

export const access = {


    hasAccess,
    
};

function hasAccess(url, token, rolesConfig) {
  
    console.log("rolesData::"+rolesConfig)
    const decryptedValue = jwtDecode(token);
    const clientIdSecret = decryptedValue['sub']?.split(":")[2];
    console.log("User Roles::"+decryptedValue['sub']?.split(":")[3])
    if(clientIdSecret != undefined && process.env.NEXTAUTH_SECRET === clientIdSecret) {

    }
}