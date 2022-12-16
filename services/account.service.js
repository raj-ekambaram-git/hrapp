import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const accountService = {
    accountsList,
    accountDetail,
    userDetails,
    getVendorList,
    getInvoiceList,
    getVendorDetail,
    getInvoiceDetail,
    getProjectDetail
};

function getVendorList(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/vendors`, {})
        .then(accounts => {
            return accounts;
        });
}

function accountsList() {
    return fetchWrapper.get(`${baseUrl}/account/list`, {})
        .then(accounts => {
            return accounts;
        });
}

function getInvoiceList(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/invoices?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getProjectDetail(projectId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/project/${projectId}/detail?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getInvoiceDetail(invoiceId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${invoiceId}/detail?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getVendorDetail(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/detail?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function accountDetail(accountId) {
    return fetchWrapper.get(`${baseUrl}/account/${accountId}/detail`, {})
        .then(account => {
            return account;
        });
}

function userDetails(userId) {
    return fetchWrapper.get(`${baseUrl}/account/user/${userId}/detail`, {})
        .then(user => {
            return user;
        });
}

