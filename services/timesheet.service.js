import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';
import { userService } from './user.service';
import { notesService } from './notes.service';
import { projectService } from './project.service';
import { util } from '../helpers/util';
import { NotesConstants } from '../constants';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const timesheetService = {

    getTimesheetDetails,
    updateTimesheetEntry,
    getTimesheetMetaForDate,
    getTimesheetByName,
    updateTimesheetEntries,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet
};

function deleteTimesheet(timesheetIds, userId, accountId) {

  return fetchWrapper.delete(`${baseUrl}/timesheet/create`, {
        name: formData.timesheetName,
        type: "Weekly",
        userId: userId,
        status: formData.status,
        startDate: formData.timesheetStartDate,
        timesheetEntries: {
          create: timesheetActivityList
        }
      }
  )
  .then(async timesheet => {
      return timesheet;
  })        
  .catch(err => {
    console.log("Error Creating createTimesheet"+err)
    return {errorMessage: err, error: true};
  });
}

function createTimesheet(formData, userId, timesheetActivityList) {

  return fetchWrapper.post(`${baseUrl}/timesheet/create`, {
        name: formData.timesheetName,
        type: "Weekly",
        userId: userId,
        status: formData.status,
        startDate: formData.timesheetStartDate,
        timesheetEntries: {
          create: timesheetActivityList
        }
      }
  )
  .then(async timesheet => {
      return timesheet;
  })        
  .catch(err => {
    console.log("Error Creating createTimesheet"+err)
    return {errorMessage: err, error: true};
  });
}

function updateTimesheet(formData, timesheetId,timesheetActivityList) {

    return fetchWrapper.put(`${baseUrl}/timesheet/`+timesheetId, {
        id: parseInt(timesheetId),
        name: formData.name,
        startDate: formData.timesheetStartDate,
        type: "Weekly",
        status: formData.status,
        timesheetEntries: timesheetActivityList
    }
  )
  .then(async timesheet => {
    return timesheet;
  })        
  .catch(err => {
    console.log("Error Creating createTimesheet"+err)
    return {errorMessage: err, error: true};
  });

}

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

  return fetchWrapper.cachedGet(`${baseUrl}/calendar/week/`+todayStr, {}, 24)
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

async function updateTimesheetEntry(timesheetUserId,billable,timesheetEntryId, status, approvalNote, approvedBy) {

  return fetchWrapper.put(`${baseUrl}/timesheet/entry/`+timesheetEntryId, {
        timesheetEntryData: {
          id: parseInt(timesheetEntryId),
          status: status,
          billable: billable,
          approvedDate: new Date(),
          approvedBy: parseInt(approvedBy)
        },
        timesheetUserId: timesheetUserId
      }
    )
    .then(timesheet => {
          console.log("AFTER UPDATING TIMESHEET::"+JSON.stringify(timesheet))
          //Timesheet entry happened, now add the notes
          if(timesheet.message === undefined && approvalNote != undefined && approvalNote != EMPTY_STRING) {
            //Create Notes
            const createdNotes = notesService.createNotes(NotesConstants.NOTES_TYPE.TimesheetEntry, timesheetEntryId, approvalNote, userService.userValue?.id);
            if(createdNotes.error) {
              return {error: createdNotes.errorMessage};
            }
  
            //Now update the project with the remaiing budget
            const totalTSEHours = util.getTotalHours(timesheet.entries);
            console.log("totalTSEHours:::"+totalTSEHours)
            if(totalTSEHours != undefined && totalTSEHours != EMPTY_STRING && timesheet.unitPrice != undefined && timesheet.unitPrice != EMPTY_STRING) {
              projectService.updateUsedBudget(timesheet.projectId, util.getZeroPriceForNull(timesheet.project?.usedBudget) + (parseFloat(totalTSEHours)*parseFloat(timesheet.unitPrice)));
            }

            //Now update the projectResource usedBudget
            
            if(totalTSEHours != undefined && totalTSEHours != EMPTY_STRING && timesheet.unitPrice != undefined && timesheet.unitPrice != EMPTY_STRING) {
              projectService.updateResourceUsedBudget(timesheet.project?.projectResource[0]?.id, util.getZeroPriceForNull(timesheet.project?.projectResource[0]?.usedBudget) + (parseFloat(totalTSEHours)*parseFloat(timesheet.unitPrice)));
            }
          }
      
      return timesheet;
    })
    .catch(err => {
    console.log("Error Updating timesheet::"+err)
    return {errorMessage: err, error: true};
    });
}
