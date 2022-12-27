import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const timesheetService = {

    getTimesheetDetails,
    updateTimesheetEntry
};


function getTimesheetDetails(timesheetId, accountId) {
    return fetchWrapper.get(`${baseUrl}/timesheet/${timesheetId}/detail?accountId=`+accountId, {})
        .then(timesheet => {
            return timesheet;
        });
}


async function updateTimesheetEntry(timesheetId, status, timesheetNote) {
    try {
        const res = await fetch(`/api/timesheet/entry/${timesheetId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: parseInt(timesheetId),
            status: status,
            comments: timesheetNote,
            approvedDate: new Date()
          }),
        });
  
        const data = await res.json();
  
        // toast.success(data.message);
        return data;
      } catch (error) {
        console.log(error)
        // toast.error("Something went wrong!");
      }
}
