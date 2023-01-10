import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { serverRuntimeConfig } = getConfig();
const baseUrl = `${serverRuntimeConfig.apiUrl}`;

export const emailService = {
    sendEmail
};

function sendEmail (emailRequest) {
    return fetchWrapper.post(`${baseUrl}/email`, {emailRequest})
        .then(email => {
            return email;
        })
        .catch(err => {
            console.log("Error emailRequest::"+err)
            return {errorMessage: err, error: true};
        });
}
