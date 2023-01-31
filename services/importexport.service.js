import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { userService } from './user.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const importExportService = {

  importTimesheetData
};

function importTimesheetData(fileData) {
  
  return fetchWrapper.put(`${baseUrl}/admin/app/import/timesheet?accountId=`+userService.getAccountDetails().accountId, {
    fileData
  })
  .then(importedData => {

    return importedData;
  })
  .catch(err => {
    console.log("Error Updating Invoice::"+err)
    return {errorMessage: err, error: true};
  });
}

