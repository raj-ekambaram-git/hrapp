import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { userService } from './user.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const configurationService = {

  getAdminAppConfigList,
  createConfigAdminLookup,
  createAppConfigAdmin,
  updateAppConfigAdmin,
  getAppConfig,
  verifyCaptcha
};

function verifyCaptcha(token) {
    return fetchWrapper.post(`${baseUrl}/token/verify`, {
      token
    })
    .then(recaptchaJson => {
      return recaptchaJson;
    })        
    .catch(err => {
      console.log("Error Creating verifyCaptcha"+err)
      return {errorMessage: err, error: true};
    });
}


function getAppConfig(appConfigId) {
  return fetchWrapper.get(`${baseUrl}/admin/app/config/`+appConfigId+'/detail?accountId='+userService.getAccountDetails().accountId, {
    }
  ) 
  .then(async appConfig => {
    return appConfig;
  })        
  .catch(err => {
    console.log("Error Creating getAppConfig"+err)
    return {errorMessage: err, error: true};
  });
}

function updateAppConfigAdmin(appConfigAdminRequest) {
  return fetchWrapper.put(`${baseUrl}/admin/app/config/`+appConfigAdminRequest.id, {
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
