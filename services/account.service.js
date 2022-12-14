import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const accountService = {
    accountsList,
    accountDetail,
    userDetails
};



function accountsList() {
    return fetchWrapper.get(`${baseUrl}/account/list`, {})
        .then(accounts => {
            return accounts;
        });
}

function accountDetail(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/detail`, {})
        .then(account => {
            return account;
        });
}

function userDetails(userId) {
    console.log("userDetailslllllllll")
    return fetchWrapper.get(`${baseUrl}/account/user/${userId}/detail`, {})
        .then(user => {
            return user;
        });
}

