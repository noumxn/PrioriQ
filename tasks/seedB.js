import {boardData} from '../data/index.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';





(async () => {


  //lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

let board1 = undefined;
let getBoard1 = undefined;
let getBoard2 = undefined;
let upBoard1 = undefined;
let delBoard1 = undefined;

console.log('1*************************************');
try {
  board1 = await boardData.createBoard('ILikeBoards', 'user1', true, null, 'hahaha');
  console.log('board1 is now here');
  console.log(board1);
} catch (e) {
  console.log(e);

}

console.log('1*************************************');

try {
  getBoard1 = await boardData.getBoardById(board1['_id'].toString());
  console.log(getBoard1);
} catch (e) {
  console.log(e);

}


console.log('1*************************************');

try {
  getBoard2 = await boardData.getBoardsByUser('user1');
  console.log(getBoard2);
} catch (e) {
  console.log(e);

}

console.log('1*************************************');
try {
  upBoard1 = await boardData.updateBoard(board1['_id'].toString(), 'Boardy', 'easy', 'hahaha');
  console.log(upBoard1);
} catch (e) {
  console.log(e);

}

console.log('1*************************************');
try {
  delBoard1 = await boardData.deleteBoard(board1['_id'].toString());
  console.log(delBoard1);
} catch (e) {
  console.log(e);

}



await closeConnection();
console.log('Done!');

})();