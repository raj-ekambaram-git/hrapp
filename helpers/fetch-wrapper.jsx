import cache from "memory-cache";
import getConfig from 'next/config';

import { userService } from 'services';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete,
    authHeader,
    filePut,
    cachedGet
};

function cachedGet(url, params, hours) {

    const cachedResponse = cache.get(url);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        if(!hours) {
            hours = 24;
        }
            
        const requestOptions = {
            method: 'GET',
            headers: authHeader(url)
        }
        const data = fetch(url, requestOptions).then(handleResponse);
        cache.put(url, data, hours * 1000 * 60 * 60);
        return data;
    }
}

function get(url, params) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)

    };
    return fetch(url, requestOptions).then(handleResponse);
}


function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

function filePut(url, body, type) {
    try{
        return fetch(url, {
            method: 'PUT',
            body: body,
                  headers: {
              "Content-Type": type,
            }
          })
    }catch(error) {
        console.log("ERRRORORORR::"+error)
    }
}
// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const isLoggedIn = user && user.authToken;
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    const isSchedulerApiUrl = url.startsWith(publicRuntimeConfig.schedulerAPIURL);
    console.log("isApiUrl:::"+isApiUrl)
    if (isLoggedIn && (isApiUrl || isSchedulerApiUrl)) {
       return { Authorization: `Bearer ${user.authToken}`};
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function handleFileUploadResponse(response) {
    console.log("handleFileUploadResponse::");
    console.log("handleFileUploadResponse::RESPONSE:::"+response);
    return response;
}