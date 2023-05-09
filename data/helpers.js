/*
 * This file exports helper funcitons
 **/

import Ajv from 'ajv';
import EmailValidator from 'email-validator';
import moment from 'moment';
import { users } from '../config/mongoCollections.js';
import validation from '../utils/validation.js';

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
  username = username.trim().toLowerCase()
  if (username.length < 3) throw validation.returnRes('BAD_REQUEST', `Username needs to be at least 3 characters long.`);
  if (username.length > 20) throw validation.returnRes('BAD_REQUEST', `Username can not be longer than 20 characters.`);
  let regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(username)) throw validation.returnRes('BAD_REQUEST', `The username can only contain alphabets, numbers, and underscores.`);
  let regex2 = /[a-zA-Z]/;
  if (!regex2.test(username)) throw validation.returnRes('BAD_REQUEST', `Username must contain at least one alphabet.`);

  return username;
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
  if (!/[A-Z]/.test(password)) throw validation.returnRes('BAD_REQUEST', `Password must contain at least 1 Uppercase character.`);
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
  let regex = /^[A-Za-z ]+$/;
  if (!regex.test(name)) throw validation.returnRes('BAD_REQUEST', `Name can not contain special characters or numbers.`)

  return name.trim()
}

/*
 * @param {username} string
 * @description This function takes username a new user is trying to use, and makes sure it is not already in use
 * @throws {CONFLICT} if username is already taken
 **/
const checkUsernameUnique = async (username) => {
  const userCollection = await users();
  const searchedUser = await userCollection.findOne({ username: username });
  if (searchedUser) throw validation.returnRes('CONFLICT', `The username '${username}' is already taken.`);
}

/*
 * @param {priority} Number
 * @description This function takes priority and makes sure it is a valid number in the range 1-10
 * @throws {BAD_REQUEST} if number is a float
 * @throws {BAD_REQUEST} if number is not in the range 1-10
 * @return {priority}
 **/
const checkPriority = (priority) => {
  priority = Number(priority);
  validation.numberValidCheck(priority);
  if (priority > 10 || priority < 1)
    throw validation.returnRes('BAD_REQUEST', `Priority needs to be in the range 1 - 10.`);
  if (!Number.isInteger(priority))
    throw validation.returnRes('BAD_REQUEST', `Priority should be a whole number.`);

  return priority
}

const checkPriorityScheduling = (priorityScheduling) => {
  if (priorityScheduling.trim() != "true" && priorityScheduling.trim() != "false") {
    throw validation.returnRes('BAD_REQUEST', `Priority Scheduling must be true or false.`);
  }
  return priorityScheduling.trim();
}

/*
 * @param {taskName} string
 * @description This function takes taskName and makes sure it is less than 30 chars
 * @throws {BAD_REQUEST} if taskName longer than 30 chars
 * @return {taskName} after trimming leading and trailing spaces
 **/
const checkTaskName = (taskName) => {
  taskName = taskName.trim()
  if (taskName.length > 30)
    throw validation.returnRes('BAD_REQUEST', `Name of the task can not exceed 30 characters.`);
  return taskName;
}

/*
 * @param {description} string
 * @description This function takes description and makes sure it is less than 100 chars
 * @throws {BAD_REQUEST} if description longer than 100 chars
 * @return {description} after trimming leading and trailing spaces
 **/
const checkDescription = (description) => {
  if (description.length > 100)
    throw validation.returnRes('BAD_REQUEST', `Description of the task can not exceed 100 characters.`);
  return description;
}

/*
 * @param {difficulty} string
 * @description This function takes difficulty and makes sure it is a valid difficulty level
 * @throws {BAD_REQUEST} if difficulty is anything other than: veryEasy, easy, medium, hard, veryHard.
 * @return {difficulty} after trimming leading and trailing spaces
 **/
const checkDifficulty = (difficulty) => {
  difficulty = difficulty.trim()
  if (
    difficulty !== "veryEasy" &&
    difficulty !== "easy" &&
    difficulty !== "medium" &&
    difficulty !== "hard" &&
    difficulty !== "veryHard"
  ) throw validation.returnRes('BAD_REQUEST', `The only valid values for difficulty are: veryEasy, easy, medium, hard, veryHard.`)

  return difficulty
}

/*
 * @param {userJson} object
 * @description This function should be called in the post and patch route where we get user data from the user
 *              Validates the json object we get as input from the user
 *              Makes sure no extra unrequired data is being sent in the request body
 * @throws {FORBIDDEN} if there is any extra unexpected field in the request body
 **/
const checkUserJson = (userJson) => {
  const schema = {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      dob: { type: 'string' },
      email: { type: 'string' },
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['firstName', 'lastName', 'dob', 'username', 'email', 'password'],
    additionalProperties: false
  }
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(userJson);
  if (!isValid) {
    throw validation.returnRes('FORBIDDEN', `There are unrequired fields in the request being sent.`)
  }
}

/*
 * @param {boardJson} object
 * @description This function should be called in the post and patch route where we get board data from the user
 *              Validates the json object we get as input from the user
 *              Makes sure no extra unrequired data is being sent in the request body
 * @throws {FORBIDDEN} if there is any extra unexpected field in the request body
 **/
const checkBoardJson = (boardJson) => {
  const schema = {
    type: 'object',
    properties: {
      boardName: { type: 'string' },
      owner: { type: 'string' },
      priorityScheduling: { type: 'boolean' },
      sortOrder: { type: ['string', 'null'], enum: ['asc', 'desc', null] },
      boardPassword: 'string'
    },
    required: ['boardName', 'owner', 'priorityScheduling', 'sortOrder', 'boardPassword'],
    additionalProperties: false
  }
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(boardJson);
  if (!isValid) {
    throw validation.returnRes('FORBIDDEN', `There are unrequired fields in the request being sent.`)
  }
}

/*
 * @param {boardJson} object
 * @description This function should be called in the post and patch route where we get task data from the user
 *              Validates the json object we get as input from the user
 *              Makes sure no extra unrequired data is being sent in the request body
 * @throws {FORBIDDEN} if there is any extra unexpected field in the request body
 **/
const checkTaskJson = (taskJson) => {
  const schema = {
    type: 'object',
    properties: {
      taskName: { type: 'string' },
      priority: { type: 'number' },
      difficulty: { type: ['string', 'null'], enum: ['veryEasy', 'easy', 'medium', 'hard', 'veryHard', null] },
      estimatedTime: { type: 'string' },
      deadline: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['taskName', 'priority', 'difficulty', 'estimatedTime', 'deadline', 'description'],
    additionalProperties: false
  }
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(taskJson);
  if (!isValid) {
    throw validation.returnRes('FORBIDDEN', `There are unrequired fields in the request being sent.`)
  }
}

/*
 * @param {priorityScheduling} boolean
 * @param {sortOrder} [boolean, 'asc', 'desc']
 * @description This function sets sortOrder value to null if priorityScheduling is set to true
 *              If priorityScheduling is false, it makes sure sortOrder is either 'asc' or 'desc'
 * @throws {BAD_REQUEST} if priorityScheduling is false and sortOrder is  not 'asc' or 'desc'
 * @return {sortOrder} after trimming leading and trailing spaces, and converting to lower case
 **/
const checkSortOrderValue = (priorityScheduling, sortOrder) => {
  if (priorityScheduling === true) {
    sortOrder = null;
    return sortOrder
  } else if (priorityScheduling === false) {
    if (sortOrder === null) throw validation.returnRes("BAD_REQUEST", `Sort Order needs to be either 'asc' or 'desc'.`);
    if (sortOrder.trim().toLowerCase() !== 'asc' && sortOrder.trim().toLowerCase() !== 'desc') {
      throw validation.returnRes("BAD_REQUEST", `Sort Order needs to be either 'asc' or 'desc'.`);
    }
  }

  return sortOrder.trim().toLowerCase();
}

/*
 * @param {email} string
 * @description This function checks if an email is in currently in use 
 * @return {true} if email is in use already
 * @return {false} if email is not in use already
 **/
const checkEmailInUse = async (email) => {
  email = email.trim().toLowerCase();
  const userCollection = await users();
  const userList = await userCollection.find({}, {}).toArray();
  if (userList.length != 0) {
    for (let i = 0; i < userList.length; i++) {
      if (email === userList[i].email) {
        return true;
      }
    }
  }
  return false;
}

/*
 * @param {inputTime} string
 * @description This function takes the estimated time given in hours and mins in the string format 
 *              and converts it to millisecods for the priorityAssignmentAlgorithm() function
 * @throws {BAD_REQUEST} if input is not in HH hours MM mins format
 * @return {totalMilliseconds} Returns the total estimatedTime after converting it to millisecods
 **/
const convertEstimatedTimeToMs = (inputTime) => {
  const regex = /^(\d+)\s*hours?\s*(\d+)\s*mins?$/;
  const match = inputTime.match(regex);
  if (!match) {
    throw validation.returnRes('BAD_REQUEST', 'Invalid input format. Please use the format "HH hours MM mins".');
  }
  const hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const totalMinutes = hours * 60 + mins;
  const totalSeconds = totalMinutes * 60;
  const totalMilliseconds = totalSeconds * 1000;

  return totalMilliseconds;
}

export default {
  checkAge,
  checkEmail,
  checkUsername,
  checkPassword,
  checkName,
  convertEstimatedTimeToMs,
  checkUsernameUnique,
  checkPriority,
  checkPriorityScheduling,
  checkTaskName,
  checkDescription,
  checkDifficulty,
  checkUserJson,
  checkBoardJson,
  checkTaskJson,
  checkSortOrderValue,
  checkEmailInUse,
}
