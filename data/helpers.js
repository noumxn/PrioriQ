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

// This function makes sure username is valid
const checkUsername = (username) => {
  validation.strValidCheck(username);
  if (username.length < 3) throw throwErr('BAD_REQUEST', `Username needs to be at least 3 characters long.`);
  if (username.length > 20) throw throwErr('BAD_REQUEST', `Username can not be longer than 20 characters.`);
  let regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) throw throwErr('BAD_REQUEST', `The username can only contain alphabets, numbers, and underscores.`);
  let regex2 = /[a-zA-Z]/;
  if (!regex2.test(username)) throw throwErr('BAD_REQUEST', `Username must contain at least one alphabet.`);
  // TODO: Should probably convert all usernames to lowercase somewhere around here
  // TODO: Add check to make sure username doesn't already exist in the database
}

// This function makes sure password is valid
const checkPassword = (password) => {
  validation.strValidCheck(password);
  if (password.length < 6) throw throwErr('BAD_REQUEST', `Password must be longer than 6 characters.`);
  if (password.length > 20) throw throwErr('BAD_REQUEST', `Password can not be longer than 20 characters.`);
  let regex = /\d+/;
  if (!regex.test(password)) throw throwErr('BAD_REQUEST', `Password must contain at least 1 number.`)
  let regex2 = /.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?].*/;
  if (!regex2.test(password)) throw throwErr('BAD_REQUEST', `Password must contain at least 1 special character.`)
}

export default {
  checkAge,
  checkEmail,
  checkUsername,
  checkPassword,
}
