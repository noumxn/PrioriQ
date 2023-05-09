import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';
dotenv.config();



const exportedMethods = {
  /*
   * @description This funciton finds an retrieves all existing users
   * @throws {NOT_FOUND} if unable to retrive all users
   * @return {userList} Returns a list of all existing users
   **/
  async getAllUsers() {
    //Gets all users in the Users Database
    const userCollection = await users();
    const userlist = await userCollection.find({}, {}).toArray();
    //throw error if userList is not able to be found
    if (!userlist) throw validation.returnRes('NOT_FOUND', `Could not get all users.`);
    userlist.forEach(function (x) {
      x["_id"] = x["_id"].toString();
    });
    return userlist;
  },

  /*
   * @param {username} string
   * @description This funciton finds an retrieves a user given a valid username
   * @throws {NOT_FOUND} if no user exists with given username
   * @return {searchedUser} Returns the user with given username
   **/
  async getUserByUsername(username) {
    // Data validation
    validation.parameterCheck(username);
    validation.strValidCheck(username);
    username = username.trim().toLowerCase();

    // Searching user by username
    const userCollection = await users();
    const searchedUser = await userCollection.findOne({ username: username });
    if (!searchedUser) throw validation.returnRes('NOT_FOUND', `No user with the username: ${username}.`)

    return searchedUser;
  },

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
    const searchedUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!searchedUser) throw validation.returnRes('NOT_FOUND', `No user with the id: ${userId}.`);
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
    await helpers.checkUsernameUnique(username);
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
    //check if email is already in use
    let inUse = await helpers.checkEmailInUse(email);
    if (inUse) {
      throw validation.returnRes('CONFLICT', `The email ${email} is already in use. Please try another`);
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw validation.returnRes('UNAUTHROIZED', `Could not create new user. Try again.`);
    }
    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);

    return user;
  },

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
  async updateUser(userId, firstName, lastName, dob, email, username, password) {
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

    // create updated user
    let updatedUser = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      username: username
    };
    // password hashing if password changes
    const user = await this.getUserById(userId);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      updatedUser.password = await bcrypt.hash(password, saltRounds);
    }
    //check if username and email are changed, and if so check to see if unique
    if (user.username != username) {
      await helpers.checkUsernameUnique(username);
    }
    if (user.email != email) {
      let inUse = await helpers.checkEmailInUse(email);
      if (inUse) {
        throw validation.returnRes('CONFLICT', `The email ${email} is already in use. Please try another`)
      }
    }

    // update user from given userId with new info
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedUser },
      { returnDocument: 'after' }
    );
    if (updateInfo.lastErrorObject.n == 0) {
      throw validation.returnRes('NOT_FOUND', `Could not find and update user`);
    }
    return await this.getUserById(userId);
  },

  /*
   * @param {userId} string 
   * @description This function deletes an user based off the userId inputted
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a user
   * @return {user} Returns the username of user removed
   **/
  async deleteUser(userId) {
    validation.parameterCheck(userId);
    validation.strValidCheck(userId);
    userId = validation.idCheck(userId);

    // remove user based off userId
    const userCollection = await users();
    const deleteInfo = await userCollection.findOneAndDelete(
      { _id: new ObjectId(userId) }
    );
    if (deleteInfo.lastErrorObject.n == 0) throw validation.returnRes(`NOT_FOUND`, `Could not find and delete user with ID: '${userId}'`)
    // return username of deleted user saying they have been deleted
    return `User ${deleteInfo.value.username} has been deleted.`
  },

  /*
   * @param {username} string 
   * @param {password} string
   * @description This function verifies the password a user enters while logging in
   * @throws {UNAUTHORIZED} if all user enters an invalid password
   * @return {user} Returns a Success object with status: 200 and message: `You are now logged in as '${username}'.`
   **/
  async authenticateUser(username, password) {
    // Data validation
    validation.parameterCheck(username, password);
    validation.strValidCheck(username, password);

    // Verifying username and password entered match
    const user = await this.getUserByUsername(username);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw validation.returnRes('UNAUTHORIZED', `The username and password do not match.`);
    } else {
      return user;
    }
  },
};

export default exportedMethods;
