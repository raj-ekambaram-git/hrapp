import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { serverRuntimeConfig } = getConfig();
const { publicRuntimeConfig } = getConfig();
const serverBaseUrl = `${serverRuntimeConfig.apiUrl}`;
const publicBaseUrl = `${publicRuntimeConfig.apiUrl}`;

export const emailService = {
    sendEmail
};

function sendEmail (emailRequest) {
    let baseUrl = publicBaseUrl;
    if(serverBaseUrl != undefined)
    {
        baseUrl = publicBaseUrl;
    }
    
    return fetchWrapper.post(`${baseUrl}/email`, {emailRequest})
        .then(email => {
            return email;
        })
        .catch(err => {
            console.log("Error emailRequest::"+err)
            return {errorMessage: err, error: true};
        });
}
