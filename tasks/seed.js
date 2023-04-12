import {closeConnection, dbConnection} from '../config/mongoConnection.js';
import {userData} from '../data/index.js';
import {boardData} from '../data/index.js';
import {taskData} from '../data/index.js';

(async () => {
  let tom = undefined;
  let john = undefined;
  let tomBoard = undefined;
  let firstTask = undefined;
  let secondTask = undefined;
  let updatedTask = undefined;

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
    john = await userData.createUser("John", "Arbuckle", "10/28/1995", "john@stevens.go", "john_brown", "hello123*");
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Verifying Users...");
  console.log("├─ Adding Boards...");

  try {
    tomBoard = await boardData.createBoard("First Board", "tom_smith", "true", "asc", "thepassword");
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Adding Shared Boards...");
  console.log("└─ Adding Tasks...");
  try {
    firstTask = await taskData.createTask(tomBoard._id, "what", 7, "easy", "30 minutes", "12/15/2016", "This is a test task", ["tom_smith"]);
    secondTask = await taskData.createTask(tomBoard._id, "yo", 10, "hard", "30 minutes", "12/15/2016", "This is a test task2", ["tom_smith"]);
  } catch (e) {
    console.log(e);
  }
  try {
    //console.log(await taskData.getTaskById(secondTask.toDo[0]._id, tomBoard._id));
    //console.log(secondTask.toDo[0]._id);
    updatedTask = await taskData.updateTask(secondTask.toDo[0]._id.toString(), "New name!", 7, "hard", "60 minutes", "12/16/2016", "Lol. Lmao.", ["tom_smith"]);
    //console.log(await taskData.getTaskById(updatedTask._id.toString()));
    //await taskData.deleteTask(secondTask.toDo[1]._id.toString());
   // await taskData.deleteTask(secondTask.toDo[0]._id.toString());
    //console.log(await boardData.getBoardById(tomBoard._id));
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!")
}
)();