/*
  * This file exports functions for error handling and validation checks for different data
  * */

import {ObjectId} from 'mongodb';
import Ajv from 'ajv';
import moment from 'moment';

// Define response types
const response = Object.freeze({
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
const throwErr = (type, message) => createResponseObject(response[type], message);

// Send error response to client
const sendErrResponse = (res, {status, message}) => {
  res.status(status || response.INTERNAL_SERVER_ERROR.status).json(message ? {message} : '');
};


// This function checks if any of the parameters provided are null or undefined
const parameterCheck = (...param) => {
  for (let i in param) {
    if (!param[i] && param[i] !== 0) // (!varName) also throws if param is 0. So making sure 0 doesn't get caught.
      throw throwErr('BAD_REQUEST', `An Input Parameter is undefined.`);
  }
}

// This function checks if an ID is provided and if it is a valid ObjectId
const idCheck = (id) => {
  if (!id) throw badReqErr(`You must provide an ID.`);
  if (typeof id !== 'string') throw throwErr('BAD_REQUEST', `ID must be a string.`);
  id = id.trim();
  if (id.length === 0)
    throw throwErr('BAD_REQUEST', `ID cannot be an empty string or just spaces`);
  if (!ObjectId.isValid(id)) throw throwErr('BAD_REQUEST', `Invalid object ID`);
  return id;
}

// This function checks if all of the parameters provided are valid Arrays
const arrayValidCheck = (...arr) => {
  for (let i in arr) {
    if (!Array.isArray(arr[i])) {
      throw throwErr('BAD_REQUEST', `${arr[i]} is not of type Array.`);
    }
    if (arr[i].length < 1) {
      throw throwErr('BAD_REQUEST', `Array can not be empty.`);
    }
  }
}

// This function checks if all of the parameters provided are valid strings
const strValidCheck = (...str) => {
  for (let i in str) {
    if (typeof str[i] !== 'string') {
      throw throwErr('BAD_REQUEST', `${str[i]} is not of type string.`);
    }
    if (str[i].trim().length === 0) {
      throw throwErr('BAD_REQUEST', `A string can not be empty or just filled with spaces.`);
    }
  }
}

// This function checks if all of the parameters provided are valid Objects
const objValidCheck = (...obj) => {
  for (let i in obj) {
    // Object.prototype.toString.call(obj[i]) !== '[object Object]'
    if (typeof obj[i] !== 'object' || obj[i] === null || Array.isArray(obj[i])) {
      throw throwErr('BAD_REQUEST', `Input of type Object is required.`);
    }
    if (Object.keys(obj[i]).length === 0) {
      throw throwErr('BAD_REQUEST', `Can not give empty Object as input.`);
    }
  }
}

// This function checks if all of the parameters provided are valid numbers
const numberValidCheck = (...num) => {
  for (let i in num) {
    if (typeof num[i] !== 'number' || Number.isNaN(num[i]) || !Number.isFinite(num[i])) {
      throw throwErr('BAD_REQUEST', `Input provided must be a number.`);
    }
  }
}

// This function checks if dates provided are valid dates and are in the range 1920 - current year
// and follow the MM/DD/YYYY format
const validDateCheck = (date) => {
  const d = moment(date, 'MM/DD/YYYY');
  if (!d.isValid()) throw throwErr('BAD_REQUEST', `${d}. Date must be in MM/DD/YYYY format.`);
  let year = parseInt(date.slice(6));
  let minYear = 1920;
  let maxYear = Number(moment().add(1, 'year').format('YYYY'));
  if (year < minYear || year > maxYear)
    throw throwErr('BAD_REQUEST', `Date must be within the range ${minYear} and ${maxYear}.`);
}


export default {
  throwErr,
  sendErrResponse,
  parameterCheck,
  idCheck,
  arrayValidCheck,
  strValidCheck,
  objValidCheck,
  numberValidCheck,
  validDateCheck,
}
