
import { ExpenseType } from '@prisma/client';
import validator from 'validator';
import { EMPTY_STRING, INVOICE_PAY_TERMS, USER_ROLE_DESC } from '../constants/accountConstants';
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
import cookie from 'js-cookie'
import jwtDecode from 'jwt-decode';

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
    isValidLastFour
};

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
      if(expenseEntry.billable) {
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