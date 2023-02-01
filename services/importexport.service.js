import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { userService } from './user.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const importExportService = {

  importTimesheetData,
  getTableMetaData,
  exportData
};

function exportData(tableName, selectFields, filterByList, accountId) {
  return fetchWrapper.post(`${baseUrl}/admin/app/export/data?accountId=`+accountId, {
        selectFields,
        filterByList,
        tableName
      })
      .then(columnData => {
          return columnData;
      })  
      .catch(err => {
        console.log("Error Getting getTableMetaData")
        return {errorMessage: err, error: true};
    });
}

function getTableMetaData(tableName, accountId) {
  return fetchWrapper.get(`${baseUrl}/admin/app/export/${tableName}/meta?accountId=`+accountId, {})
      .then(columnData => {
          return columnData;
      })  
      .catch(err => {
        console.log("Error Getting getTableMetaData")
        return {errorMessage: err, error: true};
    });
}


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

