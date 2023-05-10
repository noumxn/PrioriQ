import { closeConnection, dbConnection } from '../config/mongoConnection.js';
import { boardData, checkListData, taskData, userData } from '../data/index.js';

(async () => {
  // Two seed users
  let tom = undefined;
  let john = undefined;

  // Three seed boards
  let tomBoard1 = undefined;
  let tomBoard2 = undefined;
  let johnBoard1 = undefined;

  // Tasks for Tom's Personal board
  let tomTask1 = undefined;
  let tomTask2 = undefined;
  let tomTask3 = undefined;
  let tomTask4 = undefined;
  let tomTask5 = undefined;
  let tomTask6 = undefined;
  let tomTask7 = undefined;
  let tomTask8 = undefined;
  let tomTask9 = undefined;

  // Tasks for John's Personal Board
  let johnTask1 = undefined;
  let johnTask2 = undefined;
  let johnTask3 = undefined;
  let johnTask4 = undefined;
  let johnTask5 = undefined;
  let johnTask6 = undefined;
  let johnTask7 = undefined;
  let johnTask8 = undefined;
  let johnTask9 = undefined;

  // Tasks for Tom's Project Board
  let projectTask1 = undefined;
  let projectTask2 = undefined;
  let projectTask3 = undefined;
  let projectTask4 = undefined;
  let projectTask5 = undefined;
  let projectTask6 = undefined;
  let projectTask7 = undefined;
  let projectTask8 = undefined;
  let projectTask9 = undefined;

  // Dates and Times
  const now = new Date();
  let time1 = undefined;
  let time2 = undefined;
  let time3 = undefined;
  let time4 = undefined;
  let time5 = undefined;
  let time6 = undefined;
  let time7 = undefined;
  let time8 = undefined;
  let time9 = undefined;
  let time10 = undefined;

  let time1UTC = undefined;
  let time2UTC = undefined;
  let time3UTC = undefined;
  let time4UTC = undefined;
  let time5UTC = undefined;
  let time6UTC = undefined;
  let time7UTC = undefined;
  let time8UTC = undefined;
  let time9UTC = undefined;
  let time10UTC = undefined;

  console.log("Seeding Database");
  console.log("├─ Setting up Database Connection...")
  try {
    const db = await dbConnection();
    await db.dropDatabase();
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Creating Users...");
  try {
    tom = await userData.createUser("Tom", "Smith", "01/12/2000", "tom@gmail.com", "tom_smith", "Hello123*");
    john = await userData.createUser("John", "Brown", "02/11/2002", "john@gmail.com", "johnb", "Hello123*");
  } catch (e) {
    console.log(e);
  }
  console.log("├─ Adding Boards...");
  try {
    // Personal Board for Tom which can't be accessed by other users. Uses Priority Based Sorting.
    tomBoard1 = await boardData.createBoard("Tom's Personal Board", "tom_smith", "true", "null", "Hello123*");
    // Shared board for Tom. John also has access to this board. Uses Priorty Based Sorting.
    tomBoard2 = await boardData.createBoard("Project Board", "tom_smith", "true", "null", "Hello123*");
    // Personal Board for John which can't be accessed by other users. Uses Difficulty Based Sorting.
    johnBoard1 = await boardData.createBoard("John's Personal Board", "johnb", "false", "desc", "Hello123*");
    // Allowing John access to Tom's Shared Board
    console.log("├─ Adding User to Shared Board...");
    await boardData.AddUserAllowedUsers(tomBoard2._id.toString(), "johnb");
  } catch (e) {
    console.log(e);
  }

  try {
    console.log("├─ Creating Dates for Tasks...");

    const now = new Date();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    time1 = new Date(now.getTime() + 10 * 60 * 1000);
    time1UTC = new Date(time1.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time2 = new Date(now.getTime() + 20 * 60 * 1000);
    time2UTC = new Date(time2.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time3 = new Date(now.getTime() + 30 * 60 * 1000);
    time3UTC = new Date(time3.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time4 = new Date(now.getTime() + 45 * 60 * 1000);
    time4UTC = new Date(time4.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time5 = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    time5UTC = new Date(time5.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time6 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    time6UTC = new Date(time6.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time7 = new Date(now.getTime() + 10 * 60 * 60 * 1000);
    time7UTC = new Date(time7.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time8 = new Date(now.getTime() + 15 * 60 * 60 * 1000);
    time8UTC = new Date(time8.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time9 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    time9UTC = new Date(time9.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

    time10 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    time10UTC = new Date(time10.toLocaleString("en-US", { timeZone: timeZone })).toISOString();

  } catch (e) {
    console.log(e)
  }

  try {
    console.log("├─ Adding Tasks to Boards...");
    // Tasks for Tom's Personal Board
    tomTask1 = await taskData.createTask(tomBoard1._id.toString(), "task1", 2, null, "00 hour 01 mins", time1UTC, "This is a test task1 on Toms Board", ["tom_smith"]);
    tomTask2 = await taskData.createTask(tomBoard1._id.toString(), "task2", 8, null, "00 hour 00 mins", time3UTC, "This is a test task2 on Toms Board", ["tom_smith"]);
    tomTask3 = await taskData.createTask(tomBoard1._id.toString(), "task3", 4, null, "00 hour 10 mins", time4UTC, "This is a test task3 on Toms Board", ["tom_smith"]);
    tomTask4 = await taskData.createTask(tomBoard1._id.toString(), "task4", 3, null, "00 hour 25 mins", time4UTC, "This is a test task4 on Toms Board", ["tom_smith"]);
    tomTask5 = await taskData.createTask(tomBoard1._id.toString(), "task5", 9, null, "00 hour 50 mins", time6UTC, "This is a test task5 on Toms Board", ["tom_smith"]);
    tomTask6 = await taskData.createTask(tomBoard1._id.toString(), "task6", 5, null, "02 hour 10 mins", time8UTC, "This is a test task6 on Toms Board", ["tom_smith"]);
    tomTask7 = await taskData.createTask(tomBoard1._id.toString(), "task7", 2, null, "03 hour 15 mins", time9UTC, "This is a test task7 on Toms Board", ["tom_smith"]);
    tomTask8 = await taskData.createTask(tomBoard1._id.toString(), "task8", 10, null, "00 hour 30 mins", time7UTC, "This is a test task8 on Toms Board", ["tom_smith"]);
    tomTask9 = await taskData.createTask(tomBoard1._id.toString(), "task9", 1, null, "00 hour 45 mins", time10UTC, "This is a test task9 on Toms Board", ["tom_smith"]);
    // Tasks for John's Personal Board
    johnTask1 = await taskData.createTask(johnBoard1._id.toString(), "task1", null, "veryEasy", "00 hour 01 mins", time1UTC, "This is a test task1 on Johns board", ["johnb"]);
    johnTask2 = await taskData.createTask(johnBoard1._id.toString(), "task2", null, "veryHard", "00 hour 00 mins", time2UTC, "This is a test task2 on Johns board", ["johnb"]);
    johnTask3 = await taskData.createTask(johnBoard1._id.toString(), "task3", null, "medium", "00 hour 01 mins", time1UTC, "This is a test task3 on Johns board", ["johnb"]);
    johnTask4 = await taskData.createTask(johnBoard1._id.toString(), "task4", null, "easy", "00 hour 02 mins", time9UTC, "This is a test task4 on Johns board", ["johnb"]);
    johnTask5 = await taskData.createTask(johnBoard1._id.toString(), "task5", null, "hard", "00 hour 02 mins", time4UTC, "This is a test task5 on Johns board", ["johnb"]);
    johnTask6 = await taskData.createTask(johnBoard1._id.toString(), "task6", null, "veryEasy", "00 hour 10 mins", time1UTC, "This is a test task6 on Johns board", ["johnb"]);
    johnTask7 = await taskData.createTask(johnBoard1._id.toString(), "task7", null, "medium", "00 hour 10 mins", time8UTC, "This is a test task7 on Johns board", ["johnb"]);
    johnTask8 = await taskData.createTask(johnBoard1._id.toString(), "task8", null, "easy", "00 hour 10 mins", time3UTC, "This is a test task8 on Johns board", ["johnb"]);
    johnTask9 = await taskData.createTask(johnBoard1._id.toString(), "task9", null, "hard", "00 hour 10 mins", time10UTC, "This is a test task9 on Johns board", ["johnb"]);

    console.log("├─ Adding Tasks To Shared Boards...");
    // Tasks for Tom's Project Board
    projectTask1 = await taskData.createTask(tomBoard2._id.toString(), "task1", 2, null, "00 hour 01 mins", time1UTC, "This is a test task1", ["tom_smith", "johnb"]);
    projectTask2 = await taskData.createTask(tomBoard2._id.toString(), "task2", 8, null, "00 hour 00 mins", time3UTC, "This is a test task2", ["tom_smith"]);
    projectTask3 = await taskData.createTask(tomBoard2._id.toString(), "task3", 4, null, "00 hour 01 mins", time3UTC, "This is a test task3", ["tom_smith", "johnb"]);
    projectTask4 = await taskData.createTask(tomBoard2._id.toString(), "task4", 3, null, "00 hour 02 mins", time2UTC, "This is a test task4", ["tom_smith"]);
    projectTask5 = await taskData.createTask(tomBoard2._id.toString(), "task5", 9, null, "00 hour 02 mins", time5UTC, "This is a test task5", ["tom_smith"]);
    projectTask6 = await taskData.createTask(tomBoard2._id.toString(), "task6", 5, null, "00 hour 10 mins", time8UTC, "This is a test task6", ["tom_smith", "johnb"]);
    projectTask7 = await taskData.createTask(tomBoard2._id.toString(), "task7", 2, null, "00 hour 10 mins", time10UTC, "This is a test task7", ["johnb"]);
    projectTask8 = await taskData.createTask(tomBoard2._id.toString(), "task8", 10, null, "00 hour 10 mins", time6UTC, "This is a test task8", ["tom_smith", "johnb"]);
    projectTask9 = await taskData.createTask(tomBoard2._id.toString(), "task9", 1, null, "00 hour 10 mins", time7UTC, "This is a test task9", ["johnb"]);
  } catch (e) {
    console.log(e);
  }
  try {
    console.log("├─ Rearranging Tasks in Boards...");
    // Tom's Personal Board
    await taskData.moveToInProgress(tomTask1._id.toString());
    await taskData.moveToInProgress(tomTask2._id.toString());
    await taskData.moveToInProgress(tomTask8._id.toString());
    await taskData.moveToInProgress(tomTask4._id.toString());
    await taskData.moveToDone(tomTask6._id.toString());
    await taskData.moveToDone(tomTask5._id.toString());

    // John's Personal Board
    await taskData.moveToInProgress(johnTask4._id.toString());
    await taskData.moveToInProgress(johnTask2._id.toString());
    await taskData.moveToInProgress(johnTask3._id.toString());
    await taskData.moveToInProgress(johnTask6._id.toString());
    await taskData.moveToDone(johnTask1._id.toString());
    await taskData.moveToDone(johnTask9._id.toString());

    // John's Personal Board
    await taskData.moveToInProgress(projectTask1._id.toString());
    await taskData.moveToInProgress(projectTask2._id.toString());
    await taskData.moveToInProgress(projectTask8._id.toString());
    await taskData.moveToInProgress(projectTask6._id.toString());
    await taskData.moveToDone(projectTask5._id.toString());
    await taskData.moveToDone(projectTask9._id.toString());
  } catch (e) {
    console.log(e);
  }
  try {
    console.log("└─ Adding Tasks to Checklists...");
    await checkListData.addTaskToCheckList(tomTask2._id.toString(), "tom_smith");
    await checkListData.addTaskToCheckList(tomTask1._id.toString(), "tom_smith");
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log("Seeding Complete!\n");
  console.log("Created two seed users:");
  console.log("User 1: Tom Smith");
  console.log("├─ Username: ", tom.username);
  console.log("├─ Password: Hello123*")
  console.log("├─ Boards: \n│  ├─ 1. Tom's Personal Board\n│  └─ 2. Project Board")
  console.log("└─ Shared Boards: ")
  console.log();
  console.log("User 2: John Brown");
  console.log("├─ Username: ", john.username);
  console.log("├─ Password: Hello123*")
  console.log("├─ Boards: \n│  └─ 1. John's Personal Board")
  console.log("└─ Shared Boards: \n   └─ 1. Project Board (Owned by: tom_smith)")
}
)();
