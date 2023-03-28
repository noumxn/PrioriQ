import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';
dotenv.config();

const exportedMethods = {
  /*
   * @param {userId} ObjectId
   * @description This funciton finds an retrieves a user given a valid ObjectId
   * @throws {NOT_FOUND} if no user exists with given userId
   * @return {searchedUser} Returns the user with given userId
   **/
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

  /*
   * @param {firstName} string 
   * @param {lastName} string 
   * @param {dob} string 
   * @param {email} string 
   * @param {username} string 
   * @param {password} string 
   * @description This funciton creates a new user object and stores it in the database
   * @description This funciton also hashes the password provided by the user before storing it
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a user
   * @return {user} Returns the user that was just created
   **/
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

  async updateUser(userId, firstName, lastName, dob, email, username, password) {
      /*
   * @param {userId} string
   * @param {firstName} string 
   * @param {lastName} string 
   * @param {dob} string 
   * @param {email} string 
   * @param {username} string 
   * @param {password} string 
   * @description This funciton updates the users info based on parameters
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a user
   * @return {user} Returns the user after updating
   **/
    validation.parameterCheck(userId, firstName, lastName, dob, email, username, password);
    validation.strValidCheck(userId, firstName, lastName, dob, email, username, password);
    userId = validation.idCheck(userId);
    firstName = helpers.checkName(firstName);
    lastName = helpers.checkName(lastName);
    dob = dob.trim()
    validation.validDateCheck(dob);
    helpers.checkAge(dob);
    email = helpers.checkEmail(email);
    username = helpers.checkUsername(username);
    helpers.checkPassword(password);
    //create updated user
    let updatedUser = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      username: username,
      password: password
    };
    //TO DO: password hashing if password changes


    //update user from given userId with new info
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set:  updatedUser},
      {returnDocument: 'after'}
    );
    if(updateInfo.lastErrorObject.n == 0){
      throw throwErr('INTERNAL_SERVER_ERROR', `Could not update user Successfully`);
    }
    //const newId = up
    return await this.getUserById(userId);
  },

  async deleteUser(userId) {
      /*
   * @param {userId} string 
   * @description This function deletes an user based off the userId inputted
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a user
   * @return {user} Returns the username of user removed
   **/
    validation.parameterCheck(userId);
    validation.strValidCheck(userId);
    userId = validation.idCheck(userId);

    //remove user based off userId
    const userCollection = await users();
    const deleteInfo = await userCollection.findOneAndDelete(
      {_id: new ObjectId(userId)}
    );
    if(deleteInfo.lastErrorObject.n == 0) throw throwErr(`INTERNAL_SERVER_ERROR`,`Could not delte user with id ${userId}`)
    //return username of deleted user saying they have been deleted
    return `User ${deleteInfo.value.username} has been deleted.`
  },
};

export default exportedMethods;
