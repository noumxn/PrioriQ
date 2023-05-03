import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {boardData} from '../data/index.js';

(async () => {
  console.log("Getting Board");
  try {
    const db = await dbConnection();
  } catch (e) {
    console.log(e);
  }
  try {
    let updatedBoard = await boardData.getBoardById('64514c33a50493fe818d19a3');
    console.log(updatedBoard);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
