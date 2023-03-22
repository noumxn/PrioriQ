/*
  * This file exports helper funcitons
  * */

import {ObjectId} from 'mongodb';
import validation from '../utils/validation.js';
import Ajv from 'ajv';
import moment from 'moment';
import EmailValidator from 'email-validator';

// This function checks if the age of a user is over 13
const checkAge = (dob) => {
  let minimumAge = 13;
  let birtday = moment(dob, 'MM/DD/YYYY');
  let age = moment().diff(birtday, 'years');
  if (age < minimumAge)
    throw validation.throwErr('FORBIDDEN', `Minimum age for registration is ${minimumAge}.`);
}

// This function makes sure the email address provided as param is valid
const checkEmail = (email) => {
  validation.strValidCheck(email);
  let isValid = EmailValidator.validate(email);
  if (!isValid) throw validation.throwErr('BAD_REQUEST', `'${email}' is an invalid email address.`);
}

export default {
  checkAge,
  checkEmail,
}
