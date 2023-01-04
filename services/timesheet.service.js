import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING, NOTES_TYPE } from '../constants/accountConstants';
import { userService } from './user.service';
import { notesService } from './notes.service';
import { projectService } from './project.service';
import { util } from '../helpers/util';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const timesheetService = {

    getTimesheetDetails,
    updateTimesheetEntry,
    getTimesheetMetaForDate,
    getTimesheetByName,
    updateTimesheetEntries
};

function updateTimesheetEntries(timesheetEntryIds, data) {
  console.log("timesheetEntryIds:::"+JSON.stringify(timesheetEntryIds)+"*****DAta::"+JSON.stringify(data));

  return fetchWrapper.put(`${baseUrl}/timesheet/entries/status/update`, {
    tsIds: timesheetEntryIds,
    data: data
  }
  ).then(tsEntries => {
    return tsEntries;
  }).catch(err => {
    console.log("Successfylly Created Invooice But error updating timesheets::"+err)
    return {errorMessage: err, error: true};
  });

}
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
  
        //Timesheet entry happened, now add the notes
        if(data.message === undefined && timesheetNote != undefined && timesheetNote != EMPTY_STRING) {
          //Create Notes
          const createdNotes = notesService.createNotes(NOTES_TYPE.Timesheet, timesheetEntryId, timesheetNote, userService.userValue?.id);
          if(createdNotes.error) {
            return {error: createdNotes.errorMessage};
          }

          //Now update the project with the remaiing budget
          const totalTSEHours = util.getTotalHours(data.entries);
          console.log("totalTSEHours:::"+totalTSEHours)
          if(totalTSEHours != undefined && totalTSEHours != EMPTY_STRING && data.unitPrice != undefined && data.unitPrice != EMPTY_STRING) {
            projectService.updateUsedBudget(data.projectId, parseFloat(totalTSEHours)*parseFloat(data.unitPrice));
          }

          
        }
  
        return data;
      } catch (error) {
        console.log(error)
        return {error: error};
      }
}
