import { closeConnection, dbConnection } from '../config/mongoConnection.js';
import { boardData } from '../data/index.js';

(async () => {
  let tom = undefined;
  let tomBoard = undefined;
  let task1 = undefined;
  let task2 = undefined;
  let task3 = undefined;
  let task4 = undefined;
  let task5 = undefined;
  let task6 = undefined;

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
