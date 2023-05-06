import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {boardData, taskData, userData, checkListData} from '../data/index.js';

(async () => {
  let tom = undefined;
  let john = undefined;
  let tomBoard = undefined;
  let johnBoard = undefined;
  let task1 = undefined;
  let task2 = undefined;
  let task3 = undefined;
  let task4 = undefined;
  let task5 = undefined;
  let task6 = undefined;
  let task7 = undefined;
  let task8 = undefined;
  let task9 = undefined;

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
    tom = await userData.createUser("Tom", "Smith", "01/12/2000", "tom@gmail.com", "tom_smith", "Hello123*");

  } catch (e) {
    console.log(e);
  }
  console.log("├─ Adding Boards...");
  try {
    tomBoard = await boardData.createBoard("First Board", "tom_smith", false, "asc", "thepassword");
    johnBoard = await boardData.createBoard("John Board 1", "john_brown", false, "desc", "thepassword");
    await boardData.AddUserAllowedUsers(tomBoard._id.toString(), "john_brown");
   // console.log(await userData.getUserById(tom._id.toString()));
  } catch (e) {
    console.log(e);
  }
  console.log("└─ Adding Tasks...");
  try {
    task1 = await taskData.createTask(tomBoard._id, "task1", null, "veryEasy", "00 hour 01 mins", "2023-05-02T17:49:40.576Z", "This is a test task1", ["tom_smith"]);
    task2 = await taskData.createTask(tomBoard._id, "task2", null, "veryHard", "00 hour 00 mins", "2023-05-02T18:04:40.576Z", "This is a test task2", ["tom_smith"]);
    task3 = await taskData.createTask(tomBoard._id, "task3", null, "medium", "00 hour 01 mins", "2023-05-02T17:50:40.576Z", "This is a test task3", ["tom_smith"]);
    task4 = await taskData.createTask(tomBoard._id, "task4", null, "easy", "00 hour 02 mins", "2023-05-02T18:04:40.576Z", "This is a test task4", ["tom_smith"]);
    task5 = await taskData.createTask(tomBoard._id, "task5", null, "hard", "00 hour 02 mins", "2023-05-02T17:49:40.576Z", "This is a test task5", ["tom_smith"]);
    task6 = await taskData.createTask(tomBoard._id, "task6", null, "veryEasy", "00 hour 10 mins", "2023-05-02T18:04:40.576Z", "This is a test task6", ["tom_smith"]);
    task7 = await taskData.createTask(tomBoard._id, "task7", null, "medium", "00 hour 10 mins", "2023-05-02T18:04:40.576Z", "This is a test task7", ["tom_smith"]);
    task8 = await taskData.createTask(tomBoard._id, "task8", null, "easy", "00 hour 10 mins", "2023-05-02T18:04:40.576Z", "This is a test task8", ["tom_smith"]);
    task9 = await taskData.createTask(tomBoard._id, "task9", null, "hard", "00 hour 10 mins", "2023-05-02T18:04:40.576Z", "This is a test task9", ["tom_smith"]);
  } catch (e) {
    console.log(e);
  }
  try {
    let updatedBoard = await boardData.getBoardById(tomBoard._id);
   // console.dir(updatedBoard, {depth: null});
  } catch (e) {
    console.log(e);
  }
  try {
    console.log("Rearranging Tasks")
    await taskData.moveToInProgress(task1._id);
    await taskData.moveToInProgress(task2._id);
    await taskData.moveToInProgress(task8._id);
    await taskData.moveToInProgress(task9._id);
    await taskData.moveToInProgress(task4._id);
    await taskData.moveToDone(task6._id);
    await checkListData.addTaskToCheckList(task2._id, "tom_smith");
    await checkListData.addTaskToCheckList(task1._id, "tom_smith");
    //console.log(await boardData.getBoardById(tomBoard._id));
    await taskData.moveToDone(task5._id);
  } catch (e) {
    console.log(e);
  }
  try {
    let updatedBoard = await boardData.getBoardById(tomBoard._id);
    //console.dir(updatedBoard, {depth: null});
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
