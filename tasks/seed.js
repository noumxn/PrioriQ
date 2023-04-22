import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {boardData, checkListData, taskData, userData} from '../data/index.js';

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
  try {
    tom = await userData.createUser("John", "Doe", "01/12/1999", "john@gmail.com", "johndoe", "password123*");
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
    task1 = await taskData.createTask(tomBoard._id, "task1", 1, null, "00 hour 01 mins", "2023-04-19T23:26:24.864Z", "This is a test task1", ["tom_smith"]);
    task2 = await taskData.createTask(tomBoard._id, "task2", 2, null, "00 hour 10 mins", "2023-04-19T23:51:24.864Z", "This is a test task2", ["tom_smith"]);
    task3 = await taskData.createTask(tomBoard._id, "task3", 3, null, "00 hour 01 mins", "2023-04-19T23:27:24.864Z", "This is a test task3", ["tom_smith"]);
    task4 = await taskData.createTask(tomBoard._id, "task4", 8, null, "00 hour 01 mins", "2023-04-19T23:31:24.864Z", "This is a test task4", ["tom_smith"]);
    task5 = await taskData.createTask(tomBoard._id, "task5", 10, null, "00 hour 02 mins", "2023-04-19T23:31:24.864Z", "This is a test task5", ["tom_smith"]);
    let boardWith5Tasks = await boardData.getBoardById(tomBoard._id)
    console.log(boardWith5Tasks);
  } catch (e) {
    console.log(e);
  }
  // try {
  //   await taskData.moveToInProgress(task2._id);
  //   await taskData.moveToInProgress(task4._id);
  //   await taskData.moveToDone(task5._id);
  // } catch (e) {
  //   console.log(e);
  // }
  try {
    await checkListData.addTaskToCheckList(task1._id, "tom_smith");
    await checkListData.addTaskToCheckList(task1._id, "johndoe");
    await checkListData.addTaskToCheckList(task2._id, "tom_smith");
    await checkListData.addTaskToCheckList(task3._id, "johndoe");
    await checkListData.addTaskToCheckList(task4._id, "johndoe");
    await checkListData.addTaskToCheckList(task5._id, "tom_smith");
    await checkListData.addTaskToCheckList(task5._id, "johndoe");
    let updatedUser = await userData.getUserByUsername('tom_smith');
    console.log(updatedUser);
    let updatedUserJohn = await userData.getUserByUsername('johndoe');
    console.log(updatedUserJohn);
  } catch (e) {
    console.log(e);
  }
  try {
    // await checkListData.completeCheckListItem(task1._id, "tom_smith");
    // await checkListData.completeCheckListItem(task3._id, "tom_smith");
    // await checkListData.completeCheckListItem(task5._id, "tom_smith");
    console.log("After name update:====================================")
    await checkListData.updateCheckListItem(task1._id, "new task 1")
    await checkListData.updateCheckListItem(task2._id, "new task 2")
    await checkListData.updateCheckListItem(task4._id, "new task 4")
    let updatedUser = await userData.getUserByUsername('tom_smith');
    console.log(updatedUser);
    let updatedUserJohn = await userData.getUserByUsername('johndoe');
    console.log(updatedUserJohn);
  } catch (e) {
    console.log(e);
  }
  try {
    // await checkListData.deleteTasksFromCheckList("tom_smith");
    // let updatedUser = await userData.getUserByUsername('tom_smith');
    // console.log(updatedUser);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();
