import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { EMPTY_STRING } from '../constants/accountConstants';
import { userService } from './user.service';
import { notesService } from './notes.service';
import { projectService } from './project.service';
import { util } from '../helpers/util';
import { CommonConstants, EmailConstants, NotesConstants } from '../constants';
import { TimesheetStatus } from '@prisma/client';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export const timesheetService = {

    getTimesheetDetails,
    updateTimesheetEntry,
    getTimesheetMetaForDate,
    getTimesheetByName,
    updateTimesheetEntries,
    updateTimesheetStatusDataEntries,
    createTimesheet,
    updateTimesheet,
    isTimesheetDeletable,
    markTimesheetDelete,
    getNewTimesheetEmailRequest,
    getTimesheetApprovalEmailRequest
};

function getTimesheetApprovalEmailRequest(timesheetEntry, saveTimesheet, notes) {

  const startPlusWeek = new Date(saveTimesheet?.startDate);
  startPlusWeek.setDate(startPlusWeek.getDate() + 7);
  
  //Logic to handle the approvers
  const approvers = [];
  timesheetEntry.project?.projectResource?.map((resource) => {
      approvers.push({email: resource.user?.email})
  })
  const jsonObject = approvers.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: uniqueArray,
    bcc: [{email: saveTimesheet.user?.email}],
    templateData: {
      timesheetName: saveTimesheet.name,
      projectName: timesheetEntry.project?.name,
      submittedBy: saveTimesheet.user?.firstName+" "+saveTimesheet.user?.lastName,
      submittedDate: util.getFormattedDate(new Date()),
      timePeriod: util.getFormattedDate(saveTimesheet.startDate)+" - "+util.getFormattedDate(startPlusWeek),
      status: timesheetEntry.status,
      reason: notes,
      approvedBy: timesheetEntry?.approvedUser?.firstName+" "+timesheetEntry?.approvedUser?.lastName
    },
    template_id: timesheetEntry.status === TimesheetStatus.Approved?EmailConstants.emailTemplate.approvedTimesheetSubmitted:EmailConstants.emailTemplate.rejectedTimesheetSubmitted
  }

}


function getNewTimesheetEmailRequest(timesheetEntry, saveTimesheet) {

  const startPlusWeek = new Date(saveTimesheet?.startDate);
  startPlusWeek.setDate(startPlusWeek.getDate() + 7);
  
  //Logic to handle the approvers
  const approvers = [];
  timesheetEntry.project?.projectResource?.map((resource) => {
    if(!approvers.includes({email: resource.user?.email})) {
      approvers.push({email: resource.user?.email})
    }    
  })
  if(!approvers.includes({email: timesheetEntry.project?.contactEmail})) {
    approvers.push({email: timesheetEntry.project?.contactEmail})
  }
  const jsonObject = approvers.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  
  return {
    withAttachment: false,
    from: CommonConstants.fromEmail,
    to: uniqueArray,
    bcc: [{email: saveTimesheet.user?.email}, {email: timesheetEntry.project?.vendor?.email}],
    templateData: {
      timesheetName: saveTimesheet.name,
      projectName: timesheetEntry.project?.name,
      submittedBy: saveTimesheet.user?.firstName+" "+saveTimesheet.user?.lastName,
      submittedDate: util.getFormattedDate(new Date()),
      timePeriod: util.getFormattedDate(saveTimesheet.startDate)+" - "+util.getFormattedDate(startPlusWeek),
      status: saveTimesheet.status
    },
    template_id: EmailConstants.emailTemplate.newTimesheetSubmitted
  }

}

function markTimesheetDelete(timesheetId, accountId) {

  return fetchWrapper.put(`${baseUrl}/timesheet/`+timesheetId, {
      id: parseInt(timesheetId),
      status: TimesheetStatus.MarkForDelete
  })
  .then(async timesheet => {
    return timesheet;
  })        
  .catch(err => {
    console.log("Error deleteTimesheet"+err)
    return {errorMessage: err, error: true};
  });

}

function isTimesheetDeletable(timesheet){
   const deletable = timesheet?.timesheetEntries.map((timesheetEntry, index)=> {
    if(timesheetEntry.status === TimesheetStatus.Approved || timesheetEntry.status === TimesheetStatus.Invoiced || timesheetEntry.status === TimesheetStatus.PartiallyInvoiced) {      
      return false;
    }
    return true;
  })
  return !deletable.includes(false);
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



function updateTimesheetStatusDataEntries(data) {
  console.log("timesheetEntryIds:::*****DAta::"+JSON.stringify(data));

  return fetchWrapper.put(`${baseUrl}/timesheet/entries/update`, {
    data: data
  }
  ).then(tsEntries => {
    return tsEntries;
  }).catch(err => {
    console.log("Successfylly Created Invooice But error updating timesheets::"+err)
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
        timesheetUserId: timesheetUserId,
        timesheetEntryNotes: approvalNote,        
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
