import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {userData} from '../data/index.js';
import {boardData} from '../data/index.js';
import {taskData} from '../data/index.js';

(async () => {
  let tom = undefined;
  let tomBoard = undefined;
  let task1 = undefined;
  let task2 = undefined;
  let task3 = undefined;
  let task4 = undefined;
  let task5 = undefined;
  let task6 = undefined;

  console.log("Seeding Database");
  console.log("├─ Setting up Database Connection")
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Creating Users...");
  try {
    tom = await userData.createUser("Tom", "Smith", "01/12/2000", "tom@gmail.com", "tom_smith", "hello123*");
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Adding Boards...");
  try {
    tomBoard = await boardData.createBoard("First Board", "tom_smith", true, "asc", "thepassword");
  } catch (e) {
    console.log(e);
  }
  console.log("└─ Adding Tasks...");
  try {
    task1 = await taskData.createTask(tomBoard._id, "task1", 7, null, "0 hour 02 minutes", "2023-04-19T04:04:38.072Z", "This is a test task1", ["tom_smith"]);
    task2 = await taskData.createTask(tomBoard._id, "task2", 2, null, "0 hour 01 minutes", "2023-04-19T04:04:38.072Z", "This is a test task2", ["tom_smith"]);
    task3 = await taskData.createTask(tomBoard._id, "task3", 1, null, "0 hour 02 minutes", "2023-04-19T04:04:38.072Z", "This is a test task3", ["tom_smith"]);
    task4 = await taskData.createTask(tomBoard._id, "task4", 8, null, "0 hour 01 minutes", "2023-04-19T04:04:38.072Z", "This is a test task4", ["tom_smith"]);
    task5 = await taskData.createTask(tomBoard._id, "task5", 10, null, "0 hour 02 minutes", "2023-04-19T04:04:38.072Z", "This is a test task5", ["tom_smith"]);
    task6 = await taskData.createTask(tomBoard._id, "task6", 9, null, "0 hour 01 minutes", "2023-04-19T04:04:38.072Z", "This is a test task6", ["tom_smith"]);
    console.log(task2);
    console.log(task4);
    console.log(task5);
  } catch (e) {
    console.log(e);
  }
  try {
    await taskData.moveToInProgress(task2._id);
    await taskData.moveToInProgress(task4._id);
    await taskData.moveToDone(task5._id);
    let updatedBoard = await boardData.getBoardById(tomBoard._id);
    console.log(updatedBoard);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
