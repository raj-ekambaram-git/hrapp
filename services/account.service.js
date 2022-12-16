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
    getProjectList,
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

function getProjectList(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/projects?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getInvoiceList(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor/${vendorId}/invoices?accountId=`+accountId, {})
        .then(vendor => {
            return vendor;
        });
}

function getProjectDetail(projectId, accountId) {
    console.log("ssseese")
    return fetchWrapper.get(`${baseUrl}/account/project/${projectId}/detail?accountId=`+accountId, {})
        .then(project => {
            console.log("project::::"+JSON.stringify(project))
            return project;
        });
}

function getInvoiceDetail(invoiceId, accountId) {
    console.log("Invoice ID::"+invoiceId+"===Accoint ID::"+accountId)
    return fetchWrapper.get(`${baseUrl}/account/invoice/${invoiceId}/detail?accountId=`+accountId, {})
        .then(invoice => {
            return invoice;
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

