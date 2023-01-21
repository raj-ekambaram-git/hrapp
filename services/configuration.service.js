import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const configurationService = {

  getAdminAppConfigList,
  createConfigAdminLookup,
  createAppConfigAdmin
};

function createAppConfigAdmin(appConfigAdminRequest) {
  return fetchWrapper.post(`${baseUrl}/admin/app/config/create`, {
        appConfigAdminRequest
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

async function getAdminAppConfigList() {

  return fetchWrapper.get(`${baseUrl}/admin/app/config/list`, {
      }
    )
    .then(adminConfigs => {
      return adminConfigs;
    })
    .catch(err => {
    console.log("Error getting config lookups::"+err)
    return {errorMessage: err, error: true};
    });
}
