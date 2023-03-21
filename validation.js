/*
  * This file exports functions for error handling and validation checks for different data
  * */
import {ObjectId} from 'mongodb';
import Ajv from 'ajv';
import moment from 'moment';

// Error types
const error = {
  BAD_REQUEST: {
    status: 400,
    message: "Invalid Request Parameter."
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Access Denied. Please provide valid JSON Web Token."
  },
  FORBIDDEN: {
    status: 403,
    message: "You are not Authorized to perform this action."
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found."
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Interal Server Error."
  }
}

Object.freeze(error);

// This function to creates new error object
const createErrorObj = (err, message) => {
  if (!err || !err.status || !err.message) throw error.INTERNAL_SERVER_ERROR;
  return {
    ...err,
    message: message ? message : err.message
  }
}
// These are convenience functions to create new error objects of specific types with custom messages if provided.
const badReqErr = (message) => createErrorObj(error.BAD_REQUEST, message);
const unauthorizedErr = (message) => createErrorObj(error.UNAUTHORIZED, message);
const forbiddenErr = (message) => createErrorObj(error.FORBIDDEN, message);
const notFoundErr = (message) => createErrorObj(error.NOT_FOUND, message);
const intServerErr = (message) => createErrorObj(error.INTERNAL_SERVER_ERROR, message);

// This function sends an error response to the client with the specified status code and message if provided.
const sendErrResponse = (res, {status, message}) =>
  res.status(status || error.INTERNAL_SERVER_ERROR.status).json(message ? {message} : '');

// This function checks if any of the parameters provided are null or undefined
const parameterCheck = (...param) => {
  for (let i in param) {
    if (!param[i] && param[i] !== 0) // (!varName) also throws if param is 0. So making sure 0 doesn't get caught.
      throw badReqErr('An Input Parameter is undefined.');
  }
}

// This function checks if an ID is provided and if it is a valid ObjectId
const idCheck = (id) => {
  if (!id) throw badReqErr(`You must provide an ID.`);
  if (typeof id !== 'string') throw badReqErr(`ID must be a string.`);
  id = id.trim();
  if (id.length === 0)
    throw badReqErr(`ID cannot be an empty string or just spaces`);
  if (!ObjectId.isValid(id)) throw badReqErr(`Invalid object ID`);
  return id;
}

// This function checks if all of the parameters provided are valid Arrays
const arrayValidCheck = (...arr) => {
  for (let i in arr) {
    if (!Array.isArray(arr[i])) {
      throw badReqErr(`${arr[i]} is not of type Array.`);
    }
    if (arr[i].length < 1) {
      throw badReqErr(`Array can not be empty.`);
    }
  }
}

// This function checks if all of the parameters provided are valid strings
const strValidCheck = (...str) => {
  for (let i in str) {
    if (typeof str[i] !== 'string') {
      throw badReqErr(`${str[i]} is not of type string.`);
    }
    if (str[i].trim().length === 0) {
      throw badReqErr(`A string can not be empty or just filled with spaces.`);
    }
  }
}

// This function checks if all of the parameters provided are valid Objects
const objValidCheck = (...obj) => {
  for (let i in obj) {
    // Object.prototype.toString.call(obj[i]) !== '[object Object]'
    if (typeof obj[i] !== 'object' || obj[i] === null || Array.isArray(obj[i])) {
      throw badReqErr(`Input of type Object is required.`);
    }
    if (Object.keys(obj[i]).length === 0) {
      throw badReqErr(`Can not give empty Object as input.`);
    }
  }
}

// This function checks if all of the parameters provided are valid numbers
const numberValidCheck = (...num) => {
  for (let i in num) {
    if (typeof num[i] !== 'number' || Number.isNaN(num[i])) {
      throw badReqErr(`Input provided must be a number.`);
    }
  }
}


export {
  badReqErr,
  notFoundErr,
  forbiddenErr,
  unauthorizedErr,
  intServerErr,
  sendErrResponse,
  parameterCheck,
  idCheck,
  arrayValidCheck,
  strValidCheck,
  objValidCheck,
  numberValidCheck,
}
