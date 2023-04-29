import {ObjectId} from "mongodb";
import userData from "./users.js";
import {users} from '../config/mongoCollections.js';
import {boards} from "../config/mongoCollections.js";
import validation from "../utils/validation.js";
import sorting from "./sortingAlgorithms.js";
import helper from "./helpers.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const exportedMethods = {
  /*
   * @param {boardName} string
   * @param {owner} string
   * @param {priorityScheduling} string
   * @param {boardPassword} string
   * @description This function creates a new board object and stores it in the database
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but funciton fails to create a board
   * @return {board} Returns the board that was just created
   **/
  async createBoard(
    boardName,
    owner,
    priorityScheduling,
    sortOrder,
    boardPassword
  ) {
    validation.parameterCheck(
      boardName,
      owner,
      priorityScheduling,
      boardPassword
    );
    validation.strValidCheck(boardName, owner, boardPassword);
    const boardOwner = await userData.getUserByUsername(owner); //
    sortOrder = helper.checkSortOrderValue(priorityScheduling, sortOrder);

    // Hashing the board password
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    boardPassword = await bcrypt.hash(boardPassword, saltRounds);


    //create data for new board
    const newBoard = {
      boardName: boardName,
      owner: owner,
      priorityScheduling: priorityScheduling,
      sortOrder: sortOrder,
      allowedUsers: [],
      blockedUsers: [],
      boardPassword: boardPassword,
      toDo: [],
      inProgress: [],
      done: [],
    };

    newBoard['allowedUsers'].push(owner);
    //get the board data
    const boardCollection = await boards();
    //insert board into database
    const insertInfo = await boardCollection.insertOne(newBoard);
    //if that doesnt work, throw error
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw validation.returnRes(
        "INTERNAL_SERVER_ERROR",
        `Could not create new board.`
      );
    //get the user data
    const userCollection = await users();
    //Adds the new board to the user's boards field
    const updatedUserWithNewBoard = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(boardOwner._id)},
      {$push: {boards: newBoard}},
      {returnNewDocument: true});
    if (!updatedUserWithNewBoard) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not add board to ${owner}'s boards.`);

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
    if (!board)
      throw validation.returnRes("NOT_FOUND", `No board with ID: ${boardId}.`);
    board._id = board._id.toString();
    board.toDo.forEach(task => {task._id = task._id.toString();});
    // Sorting the board
    if (board.priorityScheduling === true) {
      await sorting.priorityBasedSorting(board._id);
    } else if (board.priorityScheduling === false && board.sortOrder === 'asc') {
      await sorting.difficultyBasedSortAscending(board._id)
    } else if (board.priorityScheduling === false && board.sortOrder === 'desc') {
      await sorting.difficultyBasedSortDescending(board._id)
    }

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

    const board = await boardCollection.find({owner: username}).toArray();
    if (!board)
      throw validation.returnRes("NOT_FOUND", `Could not get any boards.`);
    return board;
  },


  /*
   * @param {boardId} ObjectId
   * @param {newBoardName} string
   * @param {newSortOrder} string
   * @param {newSortOrder} string
   * @description This function finds a board and updates it
   * @throws {NOT_FOUND} if no board with given boardId is found
   * @return {board} Returns board that was updated
   **/
  async updateBoard(boardId, newBoardName, newSortOrder, newBoardPassword) {
    validation.parameterCheck(
      boardId,
      newBoardName,
      newSortOrder,
      newBoardPassword
    );
    validation.strValidCheck(
      boardId,
      newBoardName,
      newSortOrder,
      newBoardPassword
    );

    boardId = validation.idCheck(boardId);

    const boardCollection = await boards();

    //if the passwords don't match, rehash it

    const board = await this.getBoardById(boardId);
    if (!board) throw validation.returnRes("NOT_FOUND", `No board with ID: ${boardId}.`);


    const passwordsMatch = await bcrypt.compare(
      newBoardPassword,
      board.boardPassword
    );

    //throw if data wasnt changed
    if(newBoardName == board.boardName && newSortOrder == board.sortOrder && passwordsMatch){
      throw validation.returnRes("NO_CONTENT", `all new parameters of board is same as before`);
    }

    //uses helper function to get newSortOrder
    newSortOrder = helper.checkSortOrderValue(board.priorityScheduling, newSortOrder);

    if (!passwordsMatch) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      newBoardPassword = await bcrypt.hash(newBoardPassword, saltRounds);
    } else {
      newBoardPassword = board.boardPassword;
    }

    // TODO: Need to make sure sortOrder is not updated when the board is using the priority setting.
    //       The sortOrder only applies to boards that have the difficulty setting

    await boardCollection.updateOne(
      {_id: new ObjectId(boardId)},
      {
        $set: {
          boardName: newBoardName,
          sortOrder: newSortOrder,
          boardPassword: newBoardPassword,
        },
      }
    );

    return await this.getBoardById(boardId);
  },

  /*
   * @param {boardId} ObjectId
   * @description This function finds board with boardId and deletes it
   * @throws {NOT_FOUND} if no board with boardId was found
   * @return {board} message indicating board has been deleted
   **/
  async deleteBoard(boardId) {
    //validation
    validation.parameterCheck(boardId);
    validation.strValidCheck(boardId);

    boardId = validation.idCheck(boardId);

    const boardCollection = await boards();
    const deletionInfo = await boardCollection.findOneAndDelete({
      _id: new ObjectId(boardId),
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw validation.returnRes('NOT_FOUND', `Could not delete board with ID: ${boardId}`);
    }

    return `Board '${deletionInfo.value.boardName}' has been deleted.`;
  },


async AddUserAllowedUsers(boardId, username) {
  //validation
  validation.parameterCheck(boardId, username);
  validation.strValidCheck(boardId, username);
  boardId = validation.idCheck(boardId);

  const boardCollection = await boards();
  const board = await this.getBoardById(boardId);
  if (!board) throw validation.returnRes("NOT_FOUND", `No board with ID: ${boardId}.`);

  let newAllowedUsers = board.allowedUsers;

  if(!(board.allowedUsers.includes(username))){
    newAllowedUsers.push(username);
  }

  await boardCollection.updateOne(
    {_id: new ObjectId(boardId)},
    {
      $set: {
        allowedUsers: newAllowedUsers,
      },
    }
  );


  //update users
  const userCollection = await users();
  const newUser = await userData.getUserByUsername(username);
  if (!newUser) throw validation.returnRes("NOT_FOUND", `No user with that username: ${username}.`);

  let newSharedBoards = newUser.sharedBoards;
  console.log(newUser.firstName);

  
    newSharedBoards.push(boardId);

  
  console.log(newUser._id.toString());
  await userCollection.updateOne(
    {_id: new ObjectId(newUser._id.toString())},
    {
      $set: {
        sharedBoards: newSharedBoards,
      },
    }
  );

  console.log(newUser.sharedBoards);



  



  return await this.getBoardById(boardId);

},


async AddUserBlockedUsers(boardId, username) {
  //validation
  validation.parameterCheck(boardId, username);
  validation.strValidCheck(boardId, username);
  boardId = validation.idCheck(boardId);

  const boardCollection = await boards();
  const board = await this.getBoardById(boardId);


  let newAllowedUsers = board.allowedUsers;
  let newBlockedUsers = board.blockedUsers;

  if(username == board.owner){
    throw validation.returnRes('FORBIDDEN', `Owner of board cannot be blocked from board`)
  }

  if(!(board.blockedUsers.includes(username))){
    newBlockedUsers.push(username);
  }

  if(board.allowedUsers.includes(username)){
    newAllowedUsers = newAllowedUsers.filter(name => name != username);
  }

  await boardCollection.updateOne(
    {_id: new ObjectId(boardId)},
    {
      $set: {
        blockedUsers: newBlockedUsers,
        allowedUsers: newAllowedUsers
      },
    }
  );

  return await this.getBoardById(boardId);

}

};

export default exportedMethods;
