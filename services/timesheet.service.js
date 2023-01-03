import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const timesheetService = {

    getTimesheetDetails,
    updateTimesheetEntry,
    getTimesheetMetaForDate,
    getTimesheetByName
};

function getTimesheetMetaForDate(todayStr) {
  console.log("getTimesheetDetailsAPICall:: todayStr ----- "+todayStr);

  return fetchWrapper.get(`${baseUrl}/calendar/week/`+todayStr, {})
  .then(wkCalendar => {

    console.log("wkCalendar:::"+JSON.stringify(wkCalendar))
      return wkCalendar;
  })        
  .catch(err => {
    console.log("Error Getting Timesheet Meta Data")
    return {errorMessage: err, error: true};
});
}

function getTimesheetDetails(timesheetId, accountId) {
    return fetchWrapper.get(`${baseUrl}/timesheet/${timesheetId}/detail?accountId=`+accountId, {})
        .then(timesheet => {
            return timesheet;
        })  
        .catch(err => {
          console.log("Error Getting getTimesheetDetails")
          return {errorMessage: err, error: true};
      });
}

function getTimesheetByName(timesheetName, userId) {
  return fetchWrapper.get(`${baseUrl}/timesheet/byname/${timesheetName}?userId=`+userId, {})
      .then(timesheets => {
          return timesheets;
      })  
      .catch(err => {
        console.log("Error Getting getTimesheetByName")
        return {errorMessage: err, error: true};
    });
}

async function updateTimesheetEntry(timesheetEntryId, status, timesheetNote) {
    try {
        const res = await fetch(`/api/timesheet/entry/${timesheetEntryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: parseInt(timesheetEntryId),
            status: status,
            approvedDate: new Date()
          }),
        });
  
        const data = await res.json();

        console.log("data.res:::"+JSON.stringify(data.res))
        //Timesheet entry happened, now add the notes
        if(data.message === undefined && timesheetNote != undefined && timesheetNote != EMPTY_STRING) {

          const notesRes = await fetch(`/api/notes/create/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "Timesheet",
              typeId: timesheetEntryId,
              notes: timesheetNote
            }),
          });
          const notesData = await notesRes.json();
          
        }
  
        return data;
      } catch (error) {
        console.log(error)
        return {error: error};
      }
}
