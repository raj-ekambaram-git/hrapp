import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const addressService = {
    getAddressByVendor
};


function getAddressByVendor(vendorId, accountId) {
    return fetchWrapper.get(`${baseUrl}/account/vendor`+vendorId+'/address?accountId='+accountId, {})
        .then(address => {
            return address;
        });
}



