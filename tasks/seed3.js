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
    let updatedBoard = await boardData.getBoardById('644717e7eaa195c43efe482d');
    console.log(updatedBoard);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
