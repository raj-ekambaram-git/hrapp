import jwtDecode from 'jwt-decode';
import { CommonConstants } from '../../constants';

export { isAuthorized };

function isAuthorized(req) {
    // make authenticate path public
    if (req.url === '/api/authenticate') {
        return;
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return false;
    }

    // verify auth credentials
    const token = req.headers.authorization;
    if( token != undefined) {
        const updatedToken = token.replace("Bearer ", "").trim()
        const decryptedValue = jwtDecode(updatedToken);
        const clientIdSecret = decryptedValue['sub']?.split(CommonConstants.USER_VALUE_DELIMITER)[2];
        if(clientIdSecret != undefined && process.env.NEXTAUTH_SECRET === clientIdSecret) {
          return true;
        }else {
            return false;
        }
    }else {
        return false;
    }

}