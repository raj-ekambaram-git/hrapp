
import validator from 'validator';
import { EMPTY_STRING } from '../constants/accountConstants';
const generator = require('generate-password');
const bcrypt = require('bcryptjs');

export const util = {
    formatPhoneNumber,
    isStrongPassword,
    getPasswordHash,
    getTempPassword,
    isValidEmail,
    getPrevioustWeekStartDateString,
    getNextWeekStartDateString,
    getFormattedDate,
    getTotalHours
};

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

function getFormattedDate(dateTime) {
  if(dateTime != undefined && dateTime != EMPTY_STRING) {
    return (new Date(dateTime?.toString()).toLocaleDateString( "en-US", { timeZone: "UTC" }) );
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

function getTempPassword() {
  return generator.generate({
    length: 8,
    numbers: true,
    symbols: true
  });
}

async function isValidEmail(email) {
  return validator.isEmail(email);
}


