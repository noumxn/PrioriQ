import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';
dotenv.config();

const exportedMethods = {
  async getUserById(userId) {
    // Data validation
    validation.parameterCheck(userId);
    validation.strValidCheck(userId);
    userId = validation.idCheck(userId);

    // Searching user by ID
    const userCollection = await users();
    const searchedUser = await userCollection.findOne({_id: new ObjectId(userId)});
    if (!searchedUser) throw validation.throwErr('NOT_FOUND', `No use with id: ${userId}.`);
    searchedUser._id = searchedUser._id.toString();

    return searchedUser;
  },

  async createUser(firstName, lastName, dob, email, username, password) {
    // Data validation
    validation.parameterCheck(firstName, lastName, dob, email, username, password);
    validation.strValidCheck(firstName, lastName, dob, email, username, password);
    firstName = helpers.checkName(firstName);
    lastName = helpers.checkName(lastName);
    dob = dob.trim()
    validation.validDateCheck(dob);
    helpers.checkAge(dob);
    email = helpers.checkEmail(email);
    username = helpers.checkUsername(username);
    helpers.checkPassword(password);
    // Hashing the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    password = await bcrypt.hash(password, saltRounds);

    // Creating User
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      username: username,
      password: password,
      boards: [],
      sharedBoards: [],
      checkList: []
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw validation.throwErr('INTERNAL_SERVER_ERROR', `Could not create new user. Try again.`);
    }
    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);

    return user;
  },

  async updateUser(userId, firstName, lastName, dob, email, username, password) {},

  async deleteUser(userId) {},
};

export default exportedMethods;
