import getConfig from 'next/config';


import { fetchWrapper } from 'helpers';
import { userService } from './user.service';
import { ConfigConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const schedulerBaseUrl = `${publicRuntimeConfig.schedulerAPIURL}`;

export const importExportService = {

  importTimesheetData,
  getTableMetaData,
  exportData,
  saveExportAsTeplate,
  getSavedExportTemplates,
  generateReport,
  exportSystemReport,
  previousImports,
  importData,
};


function importData(userId, accountId, objectType, file, importName) {
  

  if(objectType === "Timesheet") {
    const importDataRequest = {
      "jobRequestData": {
        "accountId": accountId,
        "cronExpression": "",
        "jobGroup": accountId+"_"+userId+ConfigConstants.IMPORT_JOB_SUFFIX.suffix,
        "message": "string",
        "name": importName,
        "subject": "string",
        "templateId": 0,
        "templateParams": [
          {
            "key": "importObject",
            "value": objectType
          }
        ],
        "userId": userId
      },
      "scheduleTime": {
        "scheduledTime": new Date(),
        "zoneId": "America/New_York"
      }
    }

    const formData = new FormData();
    formData.append("file", file);  
    formData.append("request", JSON.stringify(importDataRequest));

    return fetchWrapper.filePost(`${schedulerBaseUrl}/import/timesheet`, formData)
    .then(importedData => {
      return importedData;
    })
    .catch(err => {
      console.log("Error importData::"+JSON.stringify(err))
      return {errorMessage: err, error: true};
    });
  }

  
}

function previousImports(userId, accountId) {

  return fetchWrapper.get(`${schedulerBaseUrl}/scheduler/account/`+accountId+`/jobs?jobGroup=`+accountId+"_"+userId+ConfigConstants.IMPORT_JOB_SUFFIX.suffix, {})
  .then(jobs => {
      return jobs;
  })  
  .catch(err => {
      console.log("Error getScheduleJobs"+err)
      return {errorMessage: err, error: true};
  });
}

function exportSystemReport(inputData, accountId) {

  if(inputData.reportType===ConfigConstants.AVAILABLE_REPORTS.ProjectReport) {
    return fetchWrapper.get(`${baseUrl}/reports/project/`+inputData.projectId+'/detail?accountId='+accountId, {}
    )
    .then(async projectData => {
      return generateReport(projectData, inputData.templateName, inputData.templateCSS)
    })
    .catch(err => {
      return {errorMessage: err, error: true};
    });
  }
}

async function generateReport(inputData, templateName, templateCSS) {
  const reportInputData = {
    documentData: inputData,
    templateName: templateName,
    templateCSS: templateCSS
  }
  const authHeader = JSON.stringify(fetchWrapper.authHeader(`${baseUrl}/reports/generate`));
  const data = await fetch(`${baseUrl}/reports/generate/`, {
    method: 'POST',
    body: JSON.stringify(reportInputData),
    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader},
  });
  // convert the response into an array Buffer
  if(data.arrayBuffer) {
    return data.arrayBuffer();
  }else {
    return {errorMessage: "Error generateInvoice", error: true};
  }
}

function getSavedExportTemplates(accountId) {
  return fetchWrapper.get(`${baseUrl}/admin/app/export/templates?accountId=`+accountId, {})
      .then(columnData => {
          return columnData;
      })  
      .catch(err => {
        console.log("Error Getting getSavedExportTemplates")
        return {errorMessage: err, error: true};
    });
}


function saveExportAsTeplate(templateReqestData) {
  return fetchWrapper.post(`${baseUrl}/admin/app/export/template`, {
        templateReqestData
      })
      .then(exportTemplate => {
          return exportTemplate;
      })  
      .catch(err => {
        console.log("Error Getting getTableMetaData")
        return {errorMessage: err, error: true};
    });
}


function exportData(tableName, selectFields, filterByList, joinsList, accountId) {
  return fetchWrapper.post(`${baseUrl}/admin/app/export/data`, {
        selectFields,
        filterByList,
        tableName,
        joinsList,
        accountId
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

