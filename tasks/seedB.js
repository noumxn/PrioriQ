import {boardData, taskData, userData} from '../data/index.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';





(async () => {


  //lets drop the database each time this is run
  const db = await dbConnection();
  await db.dropDatabase();

  let board1 = undefined;
  let board2 = undefined;
  let getBoard1 = undefined;
  let getBoard2 = undefined;
  let addUser1 = undefined;
  let blockUser1 = undefined;
  let task1 = undefined;
  let task2 = undefined;
  let task3 = undefined;

  console.log('1*************************************')
  await userData.createUser('Jack', 'Doe', '12/12/1998', 'jack@gmail.com', 'user1', 'hello123#');
  await userData.createUser('Jonn', 'Cena', '12/12/1998', 'johncena@gmail.com', 'CantSeeMe', 'hello123#');

  console.log('1*************************************');
  try {
    board1 = await boardData.createBoard('ILikeBoards', 'user1', false, 'asc', 'hahaha');
    console.log('board1 is now here');
    console.log(board1);
  } catch (e) {
    console.log(e);

  }
  console.log('1*************************************');
  try {
    board2 = await boardData.createBoard('ILikeBoards2', 'user1', true, null, 'hahaha');
    console.log('board2 is now here');
    console.log(board2);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');

  try {
    getBoard1 = await boardData.getBoardById(board1._id.toString());
    console.log(getBoard1);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');

  try {
    addUser1 = await boardData.AddUserAllowedUsers(board1._id.toString(), 'CantSeeMe');
    console.log(addUser1);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');

  try {
    blockUser1 = await boardData.AddUserBlockedUsers(board1._id.toString(), 'CantSeeMe');
    console.log(blockUser1);
  } catch (e) {
    console.log(e);

  }


  console.log('#############Tasks################');


  console.log('1*************************************');

  try {
    getBoard2 = await boardData.getBoardsByUser('user1');
    console.log(getBoard2);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');
  try {
    task1 = await taskData.createTask(board1._id, "groceries", 2, "veryEasy", '02 hours 00 mins', '2023-04-09T16:56:13.357Z', 'get the bread', ["user1"]);
    console.log(task1);
  } catch (e) {
    console.log(e);
  }
  console.log('1*************************************');
  try {
    task2 = await taskData.createTask(board1._id, "assignment", 7, "veryEasy", '06 hours 00 mins', '2023-04-09T18:56:13.357Z', 'lab 9', ["user1"]);
    console.log(task2);
  } catch (e) {
    console.log(e);
  }
  console.log('1*************************************');
  try {
    task3 = await taskData.createTask(board1._id, "lab", 6, "veryEasy", '06 hours 00 mins', '2023-04-09T18:56:13.357Z', 'lab 7', ["user1"]);
    console.log(task3);
  } catch (e) {
    console.log(e);
  }



  // console.log('1*************************************');
  // try {
  //   delBoard1 = await boardData.deleteBoard(board1['_id'].toString());
  //   console.log(delBoard1);
  // } catch (e) {
  //   console.log(e);

  // }



  await closeConnection();
  console.log('Done!');

})();
