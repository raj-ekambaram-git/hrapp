
import { ExpenseType, TimesheetStatus } from '@prisma/client';
import validator from 'validator';
import { EMPTY_STRING, INVOICE_PAY_TERMS, USER_ROLE_DESC } from '../constants/accountConstants';
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
import cookie from 'js-cookie'
import jwtDecode from 'jwt-decode';
import { ScheduleJobConstants } from '../constants';

export const util = {
    formatPhoneNumber,
    isStrongPassword,
    getPasswordHash,
    getTempPassword,
    isValidEmail,
    getPrevioustWeekStartDateString,
    getNextWeekStartDateString,
    getFormattedDate,
    getTotalHours,
    getDayMonthFormat,
    getMonthFormat,
    getDecimalValue,
    getZeroPriceForNull,
    getFormattedDateWithTime,
    isOdd,
    getDueDateByPayTerms,
    getWithCurrency,
    getTotalBillableExpense,
    getUserRole,
    validateEmailArray,
    getLocaleDate,
    getConfigHash,
    decryptConfigHash,
    getPaymentFormattedDate,
    getPastDateFromGivenDate,
    isValidDOB,
    isValidLastFour,
    formFieldValidation,
    getCronExpression,
    getScheduleTime,
    stringToDate,
    stringToDateTime,
    getLocaleTimeZone,
    getTSEntriesArray,
    isTimesheetEntryFullyUpdated,
};


function isTimesheetEntryFullyUpdated(entries, status) {
  let isFullyUpdated = true;

  if(entries?.day1) {
    if(entries?.day1?.hours != EMPTY_STRING && entries?.day1?.hours>0 && (!entries?.day1?.status || entries?.day1?.status != status)) {
      isFullyUpdated = false
    }    
  }

  if(entries?.day2) {
    if(entries?.day2?.hours != EMPTY_STRING && entries?.day2?.hours>0 && (!entries?.day2?.status || entries?.day2?.status != status)) {
      isFullyUpdated = false
    }    
  }
  if(entries?.day3) {
    if(entries?.day3?.hours != EMPTY_STRING && entries?.day3?.hours>0 && (!entries?.day3?.status || entries?.day3?.status != status)) {
      isFullyUpdated = false
    }    
  }
  if(entries?.day4) {
    if(entries?.day4?.hours != EMPTY_STRING && entries?.day4?.hours>0 && (!entries?.day4?.status || entries?.day4?.status != status)) {
      isFullyUpdated = false
    }    
  }
  if(entries?.day5) {
    if(entries?.day5?.hours != EMPTY_STRING && entries?.day5?.hours>0 && (!entries?.day5?.status || entries?.day5?.status != status)) {
      isFullyUpdated = false
    }    
  }
  if(entries?.day6) {
    if(entries?.day6?.hours != EMPTY_STRING && entries?.day6?.hours>0 && (!entries?.day6?.status || entries?.day6?.status != status)) {
      isFullyUpdated = false
    }    
  }
  if(entries?.day7) {
    if(entries?.day7?.hours != EMPTY_STRING && entries?.day7?.hours>0 && (!entries?.day7?.status || entries?.day7?.status != status)) {
      isFullyUpdated = false
    }    
  }


   
  return isFullyUpdated;
}

function getTSEntriesArray(entries) {
  const tsEntriesArray = [];

  if(entries?.day1) {
    const day1 = {
      day: "day1",
      date: entries?.day1?.date,
      hours: entries?.day1?.hours
    }
    if(entries?.day1?.hours>0) {
      tsEntriesArray.push(day1)
    }    
  }

  if(entries?.day2) {
    const day2 = {
      day: "day2",
      date: entries?.day2?.date,
      hours: entries?.day2?.hours
    }
    if(entries?.day2?.hours>0) {
      tsEntriesArray.push(day2)
    }    
  }

  if(entries?.day3) {
    const day3 = {
      day: "day3",
      date: entries?.day3?.date,
      hours: entries?.day3?.hours
    }
    if(entries?.day3?.hours>0) {
      tsEntriesArray.push(day3)
    }    

  }

  if(entries?.day4) {
    const day4 = {
      day: "day4",
      date: entries?.day4?.date,
      hours: entries?.day4?.hours
    }
    if(entries?.day4?.hours>0) {
      tsEntriesArray.push(day4)
    }    
  }

  if(entries?.day5) {
    const day5 = {
      day: "day5",
      date: entries?.day5?.date,
      hours: entries?.day5?.hours
    }
    if(entries?.day5?.hours>0) {
      tsEntriesArray.push(day5)
    }    
  }

  if(entries?.day6) {
    const day6 = {
      day: "day6",
      date: entries?.day6?.date,
      hours: entries?.day6?.hours
    }
    if(entries?.day6?.hours>0) {
      tsEntriesArray.push(day6)
    }    
  }

  if(entries?.day7) {
    const day7 = {
      day: "day7",
      date: entries?.day7?.date,
      hours: entries?.day7?.hours
    }
    if(entries?.day7?.hours>0) {
      tsEntriesArray.push(day7)
    }    
  }
   
  return tsEntriesArray;
}


function getLocaleTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getScheduleTime(scheduleDate, scheduleHour, scheduleMinute) {
  
  return stringToDateTime(scheduleDate.toLocaleDateString("en-US", { timeZone: "America/New_York" })+"/"+scheduleHour+"/"+scheduleMinute, "mm/dd/yyyy/hh/mi","/");
}


function getCronExpression(scheduleDate, scheduleHour, scheduleMinute, recurringInterval) {
  var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];    
  var day  = days[scheduleDate.getDay()].substring(0,3);

  if(recurringInterval == ScheduleJobConstants.RECURRING_INTERVAL_VALUE.Daily) {
    return "0 "+scheduleMinute+" "+scheduleHour+" 1/1 * ? *";
  } else if (recurringInterval == ScheduleJobConstants.RECURRING_INTERVAL_VALUE.Weekly) {
    return "0 "+scheduleMinute+" "+scheduleHour+" ? * "+ day+" *";
  } else if (recurringInterval == ScheduleJobConstants.RECURRING_INTERVAL_VALUE.Monthly) {    
    return "0 "+scheduleMinute+" "+scheduleHour+" "+ scheduleDate.getDate() +" 1/1 ? * ";    
  } else if (recurringInterval == ScheduleJobConstants.RECURRING_INTERVAL_VALUE.Quarterly) {
    return "0 "+scheduleMinute+" "+scheduleHour+" "+ scheduleDate.getDate() +" 1/3 ? * ";    
  }

  return EMPTY_STRING;
}

function stringToDateTime(_date,_format,_delimiter){ 
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var hourIndex=formatItems.indexOf("hh");
            var minuteIndex=formatItems.indexOf("mi");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;            
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex], dateItems[hourIndex],dateItems[minuteIndex]);
            return new Date(new Date(formatedDate).toLocaleString());
}

function stringToDate(_date,_format,_delimiter) {
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function formFieldValidation(moduleName, formFields, toast) {

  const fieldErrors =  formFields.map((formField) => {
    if(formField?.key && (formField?.value == null || formField?.value == undefined || formField?.value == EMPTY_STRING)) {
      toast({
          title: moduleName,
          description: formField?.key+" is required field, please enter and try again",
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
      })
      return false;
    } else {
      return true;
    }
  })

  return fieldErrors.includes(false);

}

function getLocaleDate(date) {
  if(date) {
    return new Date(new Date(date?.toString()).toLocaleDateString( "en-US", { timeZone: "America/New_York" }))
  } else {
    return date
  }
  
}


function validateEmailArray(emailArray) {
  return emailArray.map((email) => {
    if(email.email) {
      return isValidEmail(email.email)
    }else {
      return false
    }
    
  }).includes(false)
}

function getUserRole() {
  const userCookie = cookie.get("user");
  if(userCookie) {
    const authToken = JSON.parse(userCookie).authToken
    const decryptedValue = jwtDecode(authToken);
    const userRolesArray = decryptedValue['sub']?.split(":")[3].split(",");
    return userRolesArray.map((role) => {
      return USER_ROLE_DESC[role]
    })  
  }
  return [EMPTY_STRING]
}

function getTotalBillableExpense(expenseEntries) {
  let totalBillableExpense = 0;
  let totalNonBillableExpense = 0;
  let totalProjectCost = 0;
  if(expenseEntries) {
    expenseEntries?.map(expenseEntry => {
      if(expenseEntry.billable && expenseEntry.type !== ExpenseType.Resource_Cost) {
        totalBillableExpense = parseFloat(totalBillableExpense)+parseFloat(expenseEntry?.amount)
      }else {
        if(expenseEntry.type === ExpenseType.Resource_Cost) {
          totalProjectCost = parseFloat(totalProjectCost)+parseFloat(expenseEntry?.amount)
        }else {
          totalNonBillableExpense = parseFloat(totalNonBillableExpense)+parseFloat(expenseEntry?.amount)
        }
        
      }      
    })

  }
  return {billableExpense: parseFloat(totalBillableExpense), nonBillableExpense: parseFloat(totalNonBillableExpense), totalProjectCost: parseFloat(totalProjectCost) }
}
function getWithCurrency(value) {
  if(value === undefined || value === EMPTY_STRING || value === null || isNaN(value)) {
    return "$ "+parseFloat(0);
  }else {
    return "$ "+parseFloat(value).toFixed(2);
  }
}

function getDueDateByPayTerms(invoiceDate, payTermInput) {
  console.log("incoiceDate:::"+invoiceDate+"******PayTerms:::"+payTermInput)
  const payTerm = INVOICE_PAY_TERMS.filter((payTerm) => payTerm.paymentTermId == payTermInput);
  var result = invoiceDate.setDate(invoiceDate.getDate() + payTerm[0]?.paymentDays);

  return getFormattedDate(new Date(result))

}
function isOdd(value) {
  if(value % 2 == 0) {
    return false
  }

  return true;
}

function getZeroPriceForNull(value) {
  if(value === undefined || value === EMPTY_STRING || value === null || isNaN(value)) {
    return parseFloat(0);
  }else {
    return parseFloat(value);
  }
}

function getDecimalValue(value) {
  if(value === undefined || value === EMPTY_STRING || value === null) {
    return null;
  }
}

function getTotalHours(entries) {
  let totalHours = 0;
    if(entries?.day1?.hours != undefined && entries?.day1?.hours != EMPTY_STRING ) {
      totalHours = totalHours + parseInt(entries?.day1?.hours);
    }
    if(entries?.day2?.hours != undefined && entries?.day2?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day2?.hours);
    }
    if(entries?.day3?.hours != undefined && entries?.day3?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day3?.hours);
    }
    if(entries?.day4?.hours != undefined && entries?.day4?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day4?.hours);
    }
    if(entries?.day5?.hours != undefined && entries?.day5?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day5?.hours);
    }
    if(entries?.day6?.hours != undefined && entries?.day6?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day6?.hours);
    }
    if(entries?.day7?.hours != undefined && entries?.day7?.hours != EMPTY_STRING) {
      totalHours = totalHours + parseInt(entries?.day7?.hours);
    }                        
    
  return totalHours;
}

function getMonthFormat(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return new Date(new Date(dateTime?.toString()).toLocaleDateString( "en-US", { timeZone: "America/New_York" })).toLocaleString('default', { month: 'long' });
    // return new Date(new Date(dateTime?.toString())).toLocaleString('default', { month: 'long' });
  }else {
    return EMPTY_STRING;
  }
  
}

function getDayMonthFormat(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return ((new Date(dateTime?.toString()).getMonth()+1)+"/"+ (new Date(dateTime?.toString()).getDate()+1));
  }else {
    return EMPTY_STRING;
  }
  
}

function getFormattedDate(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return (new Date(dateTime?.toString()).toLocaleDateString( "en-US", { timeZone: "America/New_York" }) );
  }else {
    return EMPTY_STRING;
  }
  
}
function getFormattedDateWithTime(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return (new Date(dateTime?.toString()).toLocaleString( "en-US", { timeZone: "America/New_York" }) );
  }else {
    return EMPTY_STRING;
  }
  
}

function getPrevioustWeekStartDateString(dateTime) {
  const todayMinusWeek = new Date(dateTime);
  todayMinusWeek.setDate(todayMinusWeek.getDate() - 7);
  const todayMinusWeekStr = todayMinusWeek.getFullYear()+(String(todayMinusWeek.getMonth()+1).padStart(2, "0"))+String(todayMinusWeek.getDate()).padStart(2, "0");
  console.log("todayMinusWeekStr:::"+todayMinusWeekStr);
  return todayMinusWeekStr;
}

function getNextWeekStartDateString(dateTime) {
  const todayPlusWeek = new Date(dateTime);
  todayPlusWeek.setDate(todayPlusWeek.getDate() + 7);
  const todayPlusWeekStr = todayPlusWeek.getFullYear()+(String(todayPlusWeek.getMonth()+1).padStart(2, "0"))+String(todayPlusWeek.getDate()).padStart(2, "0");
  console.log("todayPlusWeekStr:::"+todayPlusWeekStr);
  return todayPlusWeekStr;
}
function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;
  
    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");
  
    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;
  
    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;
  
    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
  
    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

function isStrongPassword(value) {
  console.log("isStrongPassword:::"+value);
  
  if (validator.isStrongPassword(value, {
    minLength: 8, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1
  })) {
    return true;
  } else {
    return false;
  }

}

function getPasswordHash(password) {
  const passwordSalt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, passwordSalt);

  return {passwordSalt: passwordSalt, passwordHash: passwordHash };
}

function getConfigHash(configuration, configurationSaltInput) {
  const crypto = require("crypto");
  const algorithm = process.env.CRYPTO_ALGO;
  let initVector = configurationSaltInput;
  if(!configurationSaltInput) {
    initVector = crypto.randomBytes(16);
  }
  let securitykey = crypto.createHash(process.env.HASH_TYPE).update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);
  const cipher = crypto.createCipheriv(algorithm, securitykey, initVector);
  let encryptedData = cipher.update(configuration, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return {configurationSalt: initVector, configurationHash: encryptedData };

}


function decryptConfigHash(configurationHash, initVector) {
  const crypto = require("crypto");
  const algorithm = process.env.CRYPTO_ALGO;
  let securitykey = crypto.createHash(process.env.HASH_TYPE).update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);
  const decipher = crypto.createDecipheriv(algorithm, securitykey.toString(), Buffer.from(initVector));
  
  let decryptedData = decipher.update(configurationHash, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;

}

function getPaymentFormattedDate(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return (new Date(dateTime?.toString()).toISOString( "en-US", { timeZone: "America/New_York" }).slice(0, 10) );
  }else {
    return EMPTY_STRING;
  }
  
}

function getPastDateFromGivenDate(dateTime, daysToBack) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    const dateMinusDays = new Date(dateTime);
    dateMinusDays.setDate(dateMinusDays.getDate() - daysToBack);  
    return (new Date(dateMinusDays?.toString()).toISOString( "en-US", { timeZone: "America/New_York" }).slice(0, 10) );
  }else {
    return EMPTY_STRING;
  }
  
}

function getTempPassword() {
  return generator.generate({
    length: 8,
    numbers: true,
    symbols: true
  });
}

function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidDOB(dob) {
  if(dob) {
    const parsedDate = Date.parse(dob)
    console.log("parsedDate::::"+parsedDate)
    
    if(isNaN(parsedDate)) {
      return false
    } 

    return true
  }
}

function isValidLastFour(dob) {
  if(dob) {
    const parsedDate = Date.parse(dob)
    console.log("parsedDate::::"+parsedDate)
    
    if(isNaN(parsedDate)) {
      return false
    } 

    return true
  }
}