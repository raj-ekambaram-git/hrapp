
import validator from 'validator';
const generator = require('generate-password');
const bcrypt = require('bcryptjs');

export const util = {
    formatPhoneNumber,
    isStrongPassword,
    getPasswordHash,
    getTempPassword,
    isValidEmail
};



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