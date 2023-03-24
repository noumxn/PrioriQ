import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import boardData from './boards.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const saltRounds = process.env.SALT_ROUNDS;

const exportedMethods = {
  async getUserById(userId) {},

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
      throw throwErr('INTERNAL_SERVER_ERROR', `Could not create new user. Try again.`);
    }
    const newId = insertInfo.insertedId.toString();
    const user = await this.get(newId);

    return user
  },

  async updateUser(userId, firstName, lastName, dob, email, username, password) {},

  async deleteUser(userId) {},
};

export default exportedMethods;
