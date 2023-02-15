import getConfig from 'next/config';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const paymentService = {

    getMethodsByAccount,
    createLinkToken,
    exchangeForAccessToken,
    accountBalance,
    updateExistingAccount,
    initiateTransfer,
    vendorPaymentAccount,
    paymentAccount,
    getPaymentTransactions,
    
};

function getPaymentTransactions(accountId, userId, transactionRequest) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/method/transactions`, {
        userId: userId,
        accountId: accountId,
        transactionRequest: transactionRequest
    })
    .then(paymentAccountTransactions => {
        return paymentAccountTransactions;
    })  
    .catch(err => {
        console.log("Error getPaymentTransactions"+err)
        return {errorMessage: err, error: true};
    });
}

function paymentAccount(vendorId, accountId, userId, paymentAccountData) {
    return fetchWrapper.post(`${baseUrl}/admin/account/vendor/payment/add`, {
        userId: userId,
        vendorId: vendorId,
        accountId: accountId,
        paymentAccountData: paymentAccountData
    })
    .then(vendorPaymentAccount => {
        return vendorPaymentAccount;
    })  
    .catch(err => {
        console.log("Error paymentAccount"+err)
        return {errorMessage: err, error: true};
    });
}

function vendorPaymentAccount(vendorId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/vendor/payment/method`, {
        vendorId: vendorId,
        accountId: accountId
    })
    .then(vendorPaymentAccount => {
        return vendorPaymentAccount;
    })  
    .catch(err => {
        console.log("Error vendorPaymentAccount"+err)
        return {errorMessage: err, error: true};
    });
}

function initiateTransfer(userId, accountId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/method/initiate_transfer`, {
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

function updateExistingAccount(userId, accountId, status, paymentMethodId) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/method/update`, {
        paymentMethodId: paymentMethodId,
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

function exchangeForAccessToken(publicToken, userId, accountId, plaidMetaData) {
    return fetchWrapper.post(`${baseUrl}/admin/account/payment/exchange_link_token`, {
        publicToken: publicToken,
        userId: userId,
        accountId: accountId,
        plaidMetaData: plaidMetaData
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

