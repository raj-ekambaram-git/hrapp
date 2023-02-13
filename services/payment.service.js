import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const paymentService = {

    getMethodsByAccount,
    createLinkToken,
    exchangeForAccessToken,
    accountBalance,
    updateExistingAccount

    
};

function updateExistingAccount(userId, accountId, status) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/method/update`, {
        userId: userId,
        accountId: accountId,
        status: status
    })
    .then(existingAccount => {
        return existingAccount;
    })  
    .catch(err => {
        console.log("Error accountBalance"+err)
        return {errorMessage: err, error: true};
    });
}

function accountBalance(userId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/method/balance`, {
        userId: userId,
        accountId: accountId
    })
    .then(balanceData => {
        return balanceData;
    })  
    .catch(err => {
        console.log("Error accountBalance"+err)
        return {errorMessage: err, error: true};
    });
}

function exchangeForAccessToken(publicToken, userId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/exchange_link_token`, {
        publicToken: publicToken,
        userId: userId,
        accountId: accountId
    })
    .then(linkData => {
        return linkData;
    })  
    .catch(err => {
        console.log("Error createLinkToken"+err)
        return {errorMessage: err, error: true};
    });
}

function createLinkToken(userId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/create_link_token`, {
        userId: userId,
        accountId: accountId
    })
    .then(linkData => {
        return linkData;
    })  
    .catch(err => {
        console.log("Error createLinkToken"+err)
        return {errorMessage: err, error: true};
    });
}

function getMethodsByAccount(userId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/info`, {
        userId: userId,
        accountId: accountId
    })
    .then(methods => {
        return methods;
    })  
    .catch(err => {
        console.log("Error getMethodsByAccount"+err)
        return {errorMessage: err, error: true};
    });
}
