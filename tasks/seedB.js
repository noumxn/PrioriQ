import {boardData, taskData, userData} from '../data/index.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';





(async () => {


  //lets drop the database each time this is run
  const db = await dbConnection();
  //await db.dropDatabase();

  let user1 = undefined;
  let board1 = undefined;
  let board2 = undefined;
  let getBoard1 = undefined;
  let getBoard2 = undefined;
  let addUser1 = undefined;
  let blockUser1 = undefined;
  let task1 = undefined;
  let task2 = undefined;
  let task3 = undefined;


/*

  const currentDate = new Date();
  //const updatedDate2 = new Date(currentDate.getTime()); 
  const updatedDate2 = new Date(currentDate.getTime() + 5 * 60 * 1000);
  const updatedDate3 = new Date(currentDate.getTime() + 20 * 60 * 1000);
  const updatedDate4 = new Date(currentDate.getTime() + 6 * 60 * 1000);
  const updatedDate5 = new Date(currentDate.getTime() + 20 * 60 * 1000);
  const updatedDate6 = new Date(currentDate.getTime() + 5 * 60 * 1000);
  const updatedDate7 = new Date(currentDate.getTime() + 20 * 60 * 1000);
  const formattedDate2 = updatedDate2.toISOString();
  console.log(formattedDate2);
  const formattedDate3 = updatedDate3.toISOString();
  console.log(formattedDate3);
  const formattedDate4 = updatedDate4.toISOString();
  console.log(formattedDate4);
  const formattedDate5 = updatedDate5.toISOString();
  console.log(formattedDate5);
  const formattedDate6 = updatedDate6.toISOString();
  console.log(formattedDate6);
  const formattedDate7 = updatedDate7.toISOString();
  console.log(formattedDate7);
  */
 /*
  console.log('1*************************************');
  await userData.createUser('Jack', 'Doe', '12/12/1998', 'jack@gmail.com', 'user1', 'hello123#');
  await userData.createUser('Jonn', 'Cena', '12/12/1998', 'johncena@gmail.com', 'cantseeme', 'Hello123#');



  try {
    user1 = await userData.getUserByUsername('cantseeme');
    console.log('user is now here');
    console.log(user1);
  } catch (e) {
    console.log(e);
  }
*/
  console.log('1*************************************');
  try {
    board1 = await boardData.createBoard('newestBoard', 'user1', true, 'asc', 'hahaha');
    console.log('board1 is now here');
    console.log(board1);
  } catch (e) {
    console.log(e);

  }
  /*
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
    getBoard1 = await boardData.getBoardById('6445a06ad291c4f39bd0f68a');
    console.log(getBoard1);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');

  try {
    addUser1 = await boardData.AddUserAllowedUsers(board1._id.toString(), 'cantseeme');
    console.log(addUser1);
  } catch (e) {
    console.log(e);

  }

  console.log('1*************************************');

  try {
    blockUser1 = await boardData.AddUserBlockedUsers(board1._id.toString(), 'cantseeme');
    console.log(blockUser1);
  } catch (e) {
    console.log(e);

  }


  console.log('1*************************************');
  try {
    board1 = await boardData.createBoard('ILikeBoardY', 'usery', true, 'asc', 'hahaha');
    console.log('board1 is now here');
    console.log(board1);
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
*/


  await closeConnection();
  console.log('Done!');

})();
