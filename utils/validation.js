/*
 * This file exports functions for error handling and validation checks for different data
 **/

import {ObjectId} from 'mongodb';
import moment from 'moment';

// Define response types
const response = Object.freeze({
  SUCCESS: {
    status: 200,
    message: "Successful."
  },
  NO_CONTENT: {
    status: 204,
    message: "Request processed but no changes made."
  },
  BAD_REQUEST: {
    status: 400,
    message: "Invalid request parameter."
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Access denied. Please provide a valid JSON Web Token."
  },
  FORBIDDEN: {
    status: 403,
    message: "You are not authorized to perform this action."
  },
  NOT_FOUND: {
    status: 404,
    message: "Not found."
  },
  CONFLICT: {
    status: 409,
    message: "Operation cannot be completed due to a conflict with existing data in the database."
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error."
  },
});

// Create new error object
const createResponseObject = (obj, message) => {
  if (!obj || !obj.status || !obj.message) {
    throw response.INTERNAL_SERVER_ERROR;
  }
  return {
    ...obj,
    message: message || obj.message
  };
};

// Convenience function to create error response object
const returnRes = (type, message) => createResponseObject(response[type], message);

// Send error response to client
const sendErrResponse = (res, {status, message}) => {
  res.status(status || response.INTERNAL_SERVER_ERROR.status).json(message ? {message} : '');
};


/*
 * @param {...param} Array of parameters
 * @description This function checks if any of the parameters provided are null or undefined
 * @throws {BAD_REQUEST} if any of the parameters provided to this function are undefined or null
 **/
const parameterCheck = (...param) => {
  for (let i in param) {
    if (typeof param[i] === 'undefined' || param[i] === null)
      throw returnRes('BAD_REQUEST', `An Input Parameter is undefined.`);
  }
}

/*
 * @param {id} ObjectId
 * @description This function checks if an ID is provided and if it is a valid ObjectId
 * @throws {BAD_REQUEST} if ID provided is undefined or null
 * @throws {BAD_REQUEST} if ID provided is not a string
 * @throws {BAD_REQUEST} if ID provided is an empty string or a string with just spaces
 * @throws {BAD_REQUEST} if ID provided is an invalid ObjectId
 * @return {id} Returns the ID after trimming leading and trailing spaces
 **/
const idCheck = (id) => {
  if (!id) throw returnRes('BAD_REQUEST', `You must provide an ID.`);
  if (typeof id !== 'string') throw returnRes('BAD_REQUEST', `ID must be a string.`);
  id = id.trim();
  if (id.length === 0)
    throw returnRes('BAD_REQUEST', `ID cannot be an empty string or just spaces.`);
  if (!ObjectId.isValid(id)) throw returnRes('BAD_REQUEST', `Invalid object ID.`);
  return id;
}

/*
 * @param {...arr} Array of Arrays
 * @description This function checks if all of the parameters provided are valid Arrays
 * @throws {BAD_REQUEST} if any of the Arrays provided to this function are not valid Arrays
 * @throws {BAD_REQUEST} if any of the Arrays provided to this function are empty
 **/
const arrayValidCheck = (...arr) => {
  for (let i in arr) {
    if (!Array.isArray(arr[i])) {
      throw returnRes('BAD_REQUEST', `${arr[i]} is not of type Array.`);
    }
    if (arr[i].length < 1) {
      throw returnRes('BAD_REQUEST', `Array can not be empty.`);
    }
  }
}

/*
 * @param {...str} Array of strings
 * @description This function checks if all of the parameters provided are valid strings
 * @throws {BAD_REQUEST} if any of the strings provided to this function are not valid strings
 * @throws {BAD_REQUEST} if any of the strings provided to this function are empty or filled with just spaces
 **/
const strValidCheck = (...str) => {
  for (let i in str) {
    if (typeof str[i] !== 'string') {
      throw returnRes('BAD_REQUEST', `${str[i]} is not of type string.`);
    }
    if (str[i].trim().length === 0) {
      throw returnRes('BAD_REQUEST', `A string can not be empty or just filled with spaces.`);
    }
  }
}

/*
 * @param {...obj} Array of objects
 * @description This function checks if all of the parameters provided are valid Objects 
 * @throws {BAD_REQUEST} if any of the objects provided to this function are not valid objects
 * @throws {BAD_REQUEST} if any of the objects provided to this function are empty
 **/
const objValidCheck = (...obj) => {
  for (let i in obj) {
    // Object.prototype.toString.call(obj[i]) !== '[object Object]'
    if (typeof obj[i] !== 'object' || obj[i] === null || Array.isArray(obj[i])) {
      throw returnRes('BAD_REQUEST', `Input of type Object is required.`);
    }
    if (Object.keys(obj[i]).length === 0) {
      throw returnRes('BAD_REQUEST', `Can not give empty Object as input.`);
    }
  }
}

/*
 * @param {...num} number
 * @description This function checks if all of the parameters provided are valid numbers
 * @throws {BAD_REQUEST} if any of the numbers provided to this function are not valid numbers
 **/
const numberValidCheck = (...num) => {
  for (let i in num) {
    if (typeof num[i] !== 'number' || Number.isNaN(num[i]) || !Number.isFinite(num[i])) {
      throw returnRes('BAD_REQUEST', `Input provided must be a number.`);
    }
  }
}

/*
 * @param {date} string
 * @description This function checks if date provided is a valid date
 * @throws {BAD_REQUEST} if data provided is not in the MM/DD/YYYY format
 * @throws {BAD_REQUEST} if data provided is not within the range 1920 and the current year
 **/
const validDateCheck = (date) => {
  const d = moment(date, 'MM/DD/YYYY');
  if (!d.isValid()) throw returnRes('BAD_REQUEST', `${d}. Date must be in MM/DD/YYYY format.`);
  let year = parseInt(date.slice(6));
  let minYear = 1920;
  let maxYear = Number(moment().add(1, 'year').format('YYYY'));
  if (year < minYear || year > maxYear)
    throw returnRes('BAD_REQUEST', `Date must be within the range ${minYear} and ${maxYear}.`);
}

/*
 * @param {date} string
 * @description This function checks if param provided is in the correct ISO date format
 * @throws {BAD_REQUEST} if data provided is not in the correct ISO date format
 **/
const validDateTimeFormatCheck = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!regex.test(date)) {
    throw returnRes('BAD_REQUEST', `Input needs to be in the the format: YYYY-MM-DDTHH:MM:SSZ`)
  }
}

export default {
  returnRes,
  sendErrResponse,
  parameterCheck,
  idCheck,
  arrayValidCheck,
  strValidCheck,
  objValidCheck,
  numberValidCheck,
  validDateCheck,
  validDateTimeFormatCheck,
}
