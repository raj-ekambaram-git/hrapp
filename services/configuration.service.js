import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const configurationService = {

  getAdminConfigList,
  createConfigAdminLookup
};


function createConfigAdminLookup(configAdminRequest) {
  // console.log("configAdminRequest::"+configAdminRequest)
  return fetchWrapper.post(`${baseUrl}/admin/config/create`, {
        configAdminRequest
      }
  )
  .then(async configAdmin => {
      return configAdmin;
  })        
  .catch(err => {
    console.log("Error Creating configAdmin"+err)
    return {errorMessage: err, error: true};
  });
}

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
