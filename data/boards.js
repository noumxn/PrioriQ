import {ObjectId} from 'mongodb';
import userData from './users.js';
import {boards} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helper from './helpers.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const exportedMethods = {


    /*
   * @param {boardName} string 
   * @param {username} string 
   * @param {priorityScheduling} string 
   * @param {sortOrder} string 
   * @param {boardPassword} string 
   * @description This function creates a new board object and stores it in the database
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a user
   * @return {board} Returns the board that was just created
   **/
  async createBoard(boardName, username, priorityScheduling, sortOrder, boardPassword) {
    validation.parameterCheck(boardName, username, priorityScheduling, boardPassword);
    validation.strValidCheck(boardName, username,boardPassword);
    //boolcheck

     // Hashing the board password
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    boardPassword = await bcrypt.hash(boardPassword, saltRounds);

    //create data for new board
    const newBoard = {
      boardName: boardName,
      username: username,
      priorityScheduling: priorityScheduling,
      sortOrder: sortOrder,
      allowedUsers: [],
      blockedUsers: [],
      boardPassword: boardPassword,
      toDo: [],
      inProgress: [],
      done: []
    }

    //get the board data
    const boardCollection = await boards();
    //insert board into database
    const insertInfo = await boardCollection.insertOne(newBoard);
    //if that doesnt work, throw error
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not create new board.`);
  
    //get the new id
    const newId = insertInfo.insertedId.toString();
  
    //get the new board from id
    const board = await this.getBoardById(newId);
    return board;



  },

    /*
   * @param {boardId} ObjectId
   * @description This finds a board given the board id
   * @throws {NOT_FOUND} if no board exists with that id
   * @return {board} Returns the board that with given id
   **/
  async getBoardById(boardId) {
    //validation
    validation.parameterCheck(boardId);
    validation.strValidCheck(boardId);
    validation.idCheck(boardId);

    const boardCollection = await boards();

    const board = await boardCollection.findOne({_id: new ObjectId(boardId)});
    if (board === null) throw validation.returnRes('NOT_FOUND', `No user with ID: ${boardId}.`);
    board._id = board._id.toString();
    return board;




  },

  
    /*
   * @param {username} string
   * @description This function finds all boards created by user given the username
   * @throws {NOT_FOUND} if no user exists with that username
   * @return {board} Returns all boards from user with that given username
   **/
  async getBoardsByUser(username) {

    validation.parameterCheck(username);
    validation.strValidCheck(username);

    
    const boardCollection = await boards();

    const boards = await boardCollection.find({username: username}).toArray();
    if (boards === null) throw validation.returnRes('NOT_FOUND', `No boards from that user.`)
    return boards;

  },



      /*
   * @param {boardId} ObjectId
   * @param {newBoardName} string
   * @param {newSortOrder} string
   * @param {newSortOrder} string
   * @description This function finds all boards created by user given the username
   * @throws {NOT_FOUND} if no user exists with that username
   * @return {board} Returns all boards from user with that given username
   **/
  async updateBoard(boardId, newBoardName, newSortOrder, newBoardPassword) {

    validation.parameterCheck(boardId, newBoardName, newSortOrder, newBoardPassword);
    validation.strValidCheck(boardId, newBoardName, newSortOrder, newBoardPassword);

    boardId = validation.idCheck(boardId);


    const boardCollection = await boards();

    

    //if the passwords match, rehash it
    /*
    const board = this.getBoardById();
    const passwordsMatch = await bcrypt.compare(newBoardPassword, board.boardPassword);
    if (!passwordsMatch) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      newBoardPassword = await bcrypt.hash(newBoardPassword, saltRounds);
    }
    */

    await boardCollection.updateOne({_id: new ObjectId(boardId)}, {$set: {boardName: newBoardName}});

    return await this.getBoardById(boardId);


    

  },
  async deleteBoard(boardId) {
    validation.parameterCheck(boardId);
    validation.strValidCheck(boardId);

    boardId = validation.idCheck(boardId);


    const boardCollection = await boards();
    const deletionInfo = await boardCollection.findOneAndDelete({ _id: new ObjectId(boardId)});
  
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete band with id of ${boardId}`;
    }

    return `Board ${deletionInfo.value.boardName} has been deleted.`
  },


};

export default exportedMethods;
