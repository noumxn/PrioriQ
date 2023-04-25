import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {boardData, taskData, userData} from '../data/index.js';

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
    task1 = await taskData.createTask(tomBoard._id, "task1", 1, null, "00 hour 01 mins", "2023-04-25T00:03:23.241Z", "This is a test task1", ["tom_smith"]);
    task2 = await taskData.createTask(tomBoard._id, "task2", 8, null, "00 hour 00 mins", "2023-04-25T00:18:23.241Z", "This is a test task2", ["tom_smith"]);
    task3 = await taskData.createTask(tomBoard._id, "task3", 4, null, "00 hour 01 mins", "2023-04-25T00:04:23.241Z", "This is a test task3", ["tom_smith"]);
    task4 = await taskData.createTask(tomBoard._id, "task4", 8, null, "00 hour 02 mins", "2023-04-25T00:18:23.241Z", "This is a test task4", ["tom_smith"]);
    task5 = await taskData.createTask(tomBoard._id, "task5", 1, null, "00 hour 02 mins", "2023-04-25T00:03:23.241Z", "This is a test task5", ["tom_smith"]);
    task6 = await taskData.createTask(tomBoard._id, "task6", 10, null, "00 hour 10 mins", "2023-04-25T00:18:23.241Z", "This is a test task5", ["tom_smith"]);
  } catch (e) {
    console.log(e);
  }
  try {
    await taskData.moveToInProgress(task1._id);
    await taskData.moveToInProgress(task2._id);
    await taskData.moveToDone(task5._id);
    await taskData.moveToDone(task6._id);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
