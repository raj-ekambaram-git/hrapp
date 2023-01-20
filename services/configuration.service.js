import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const configurationService = {

  getAdminConfigList
};

async function getAdminConfigList() {

  return fetchWrapper.get(`${baseUrl}/admin/config/lookup`, {
      }
    )
    .then(adminConfigLookups => {
      return adminConfigLookups;
    })
    .catch(err => {
    console.log("Error getting config lookups::"+err)
    return {errorMessage: err, error: true};
    });
}
