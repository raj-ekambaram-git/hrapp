import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { userService } from './user.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const importExportService = {

  importData
};

function importData(file, type) {
  return fetchWrapper.filePut(`${baseUrl}/admin/app/import/?accountId=`+userService.getAccountDetails().accountId, file, type)
  .then(response => {
      console.log("REPONSEESS")
      return response;
  });
}

