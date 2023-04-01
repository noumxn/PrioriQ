/*
 * This file exports helper funcitons
 **/

import EmailValidator from 'email-validator';
import moment from 'moment';
import validation from '../utils/validation.js';
import userData from './users.js';

/*
 * @param {dob} string
 * @description This function checks if the age of a user is over 13
 * @throws {FORBIDDEN} if user trying to register is below 13 years of age
 **/
const checkAge = (dob) => {
  let minimumAge = 13;
  let birtday = moment(dob, 'MM/DD/YYYY');
  let age = moment().diff(birtday, 'years');
  if (age < minimumAge)
    throw validation.returnRes('FORBIDDEN', `Minimum age for registration is ${minimumAge}.`);
}

/*
 * @param {email} string
 * @description This function makes sure the email address provided as param is valid
 * @throws {BAD_REQUEST} if user trying to register with an invalid email address
 **/
const checkEmail = (email) => {
  let isValid = EmailValidator.validate(email);
  if (!isValid) throw validation.returnRes('BAD_REQUEST', `'${email}' is an invalid email address.`);

  return email.trim().toLowerCase()
}

/*
 * @param {username} string
 * @description This function makes sure username is validjl
 * @throws {BAD_REQUEST} if username is less than 3 characters long
 * @throws {BAD_REQUEST} if username is more than 20 characters long
 * @throws {BAD_REQUEST} if username contains anything other than alphabets, numbers and underscores
 * @throws {BAD_REQUEST} if username does not contain at least one alphabet
 * @return {username} Returns validated username after running trim() and toLowerCase() on it
 **/
const checkUsername = (username) => {
  if (username.length < 3) throw validation.returnRes('BAD_REQUEST', `Username needs to be at least 3 characters long.`);
  if (username.length > 20) throw validation.returnRes('BAD_REQUEST', `Username can not be longer than 20 characters.`);
  let regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) throw validation.returnRes('BAD_REQUEST', `The username can only contain alphabets, numbers, and underscores.`);
  let regex2 = /[a-zA-Z]/;
  if (!regex2.test(username)) throw validation.returnRes('BAD_REQUEST', `Username must contain at least one alphabet.`);
  // TODO: Add check to make sure username doesn't already exist in the database, throw CONFLICT error

  return username.trim().toLowerCase()
}

/*
 * @param {password} string
 * @description This function makes sure password is valid
 * @throws {BAD_REQUEST} if user tries to set a password with less than 6 characters
 * @throws {BAD_REQUEST} if user tries to set a password with more than 20 characters
 * @throws {BAD_REQUEST} if user tries to set a password without a minimum of 1 numeric character
 * @throws {BAD_REQUEST} if user tries to set a password without a minimum of 1 special character
 * @throws {BAD_REQUEST} if user tries to set a password with spaces in it
 **/
const checkPassword = (password) => {
  validation.strValidCheck(password);
  if (password.length < 6) throw validation.returnRes('BAD_REQUEST', `Password must be longer than 6 characters.`);
  if (password.length > 20) throw validation.returnRes('BAD_REQUEST', `Password can not be longer than 20 characters.`);
  let regex = /\d+/;
  if (!regex.test(password)) throw validation.returnRes('BAD_REQUEST', `Password must contain at least 1 number.`);
  let regex2 = /.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?].*/;
  if (!regex2.test(password)) throw validation.returnRes('BAD_REQUEST', `Password must contain at least 1 special character.`);
  let regex3 = /^\S+$/;
  if (!regex3.test(password)) throw validation.returnRes('BAD_REQUEST', `Password can not contain spaces.`)
}

/*
 * @param {name} string
 * @description This function makes sure user follows constraints while providing their name for registration
 * @throws {BAD_REQUEST} if user tries to provide a name that is less than 1 character long
 * @throws {BAD_REQUEST} if user tries to provide a name that is longer than 20 characters
 * @throws {BAD_REQUEST} if user tries to provide a name that contains special characters
 * @return {name} Returns the name after removing leading and trailing spaces if there are any
 **/
const checkName = (name) => {
  if (name.length < 1) throw validation.returnRes('BAD_REQUEST', `Name must be longer than 1 character.`);
  if (name.length > 20) throw validation.returnRes('BAD_REQUEST', `Name can not be longer than 20 characters.`);
  let regex = /^[A-Za-z0-9 ]+$/;
  if (!regex.test(name)) throw validation.returnRes('BAD_REQUEST', `Name can not contain special characters.`)

  return name.trim()
}

/*
 * @param {hours} string
 * @param {mins} string
 * @description This function takes the estimated time given in hours and mins in the string format 
 *              and converts it to millisecods for the priorityBasedSorting() function
 * @return {totalMilliseconds} Returns the total estimatedTime after converting it to millisecods
 **/
const convertEstimatedTimeToMs = (hours, mins) => {
  const totalMinutes = Number(hours) * 60 + Number(mins);
  const totalSeconds = totalMinutes * 60;
  const totalMilliseconds = totalSeconds * 1000;
  return totalMilliseconds;
}

/*
 * @param {username} string
 * @description This function takes username a new user is trying to use, and makes sure it is not already in use
 * @throws {CONFLICT} if username is already taken
 **/
const checkUsernameUnique = async (username) => {
  const allUsers = await userData.getAllUsers();
  const duplicateUsername = allUsers.find(user => user.username === username);
  if (duplicateUsername) {
    throw validation.returnRes('CONFLICT', `The username '${username}' is already taken.`)
  }
}

export default {
  checkAge,
  checkEmail,
  checkUsername,
  checkPassword,
  checkName,
  convertEstimatedTimeToMs,
  checkUsernameUnique,
}
