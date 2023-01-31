import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const reportsService = {

  getProjects,
  generatePDFReport
};

function getProjects(accountId) {
  return fetchWrapper.get(`${baseUrl}/reports/account/`+accountId+"/projects", {
  }
  ).then(projects => {
    return projects;
  }).catch(err => {
    console.log("Error Gettting getAllProjectsForAccount::"+err)
    return {errorMessage: err, error: true};
  });

}

function generatePDFReport(urlVal, accountId) {

  return fetchWrapper.get(`${baseUrl}/reports/export?accountId=`+accountId, {query: {url: urlVal}}
  )
  .then(async exportReport => {
    return exportReport
  })
  .catch(err => {
    console.log("Error generateInvoice::"+err)
    return {errorMessage: err, error: true};
  });

}
