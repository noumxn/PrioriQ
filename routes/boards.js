//import axios from "axios";
import { Router } from "express";
import xss from 'xss';
const router = Router();

import { boardData, checkListData, taskData } from "../data/index.js";
let addpriority = undefined;


router.route("/").get(async (req, res) => {
  return res.status(400).render("../views/error", { err: 'Please input the id of the board you wish to access in the url' });
})


router.route("/:id")
  .get(async (req, res) => {
    let boardId;
    let userGet;
    let b1;
    let boardT;
    let boardS;
    let boardD;
    let boardName;
    let username;
    boardId = req.params.id;
    console.log("Got the BoardId: ", boardId);
    try {
      addpriority = false;
      username = req.session.user.username;
      boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      //console.log("Priority scheduling is now");
      //console.log(userGet.priorityScheduling);
      if (userGet.priorityScheduling == "true") {
        addpriority = true;
      } else {
        addpriority = false;
      }
      boardT = userGet.toDo;
      console.log(boardT);
      boardS = userGet.inProgress;
      boardD = userGet.done;

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: true, error: true, e: e.message });
    }
    if (userGet.blockedUsers.includes(username)) {
      return res.status(401).render("error", { titley: "Error", err: "You may not join this board." });
    }
    if (!userGet.allowedUsers.includes(username)) {
      return res.status(403).render("error", { titley: "Error", err: "You have not joined this board." });
    }
    try {
      return res.render("boards", { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, addpriority: addpriority, e: e.message });
    }

  })
  .post(async (req, res) => {
    //console.log('I got herex');
    let boardId;
    let taskName;
    let priority;
    let difficulty;
    let estimatedTimeH;
    let estimatedTimeM;
    let estimatedTime;
    let deadline;
    let description;
    let assignedTo;
    let newTask;
    let userGet;
    let boardT;
    let boardS;
    let boardD;
    let boardName;

    boardId = req.params.id;
    //console.log(boardId);
    taskName = xss(req.body.taskNameInput);
    if (typeof (xss(req.body.priorityInput)) === 'undefined') {
      priority = null;
    }
    else {
      priority = xss(req.body.priorityInput);
    }
    if (typeof (xss(req.body.difficultyInput)) === 'undefined') {
      difficulty = null;
    }
    else {
      difficulty = xss(req.body.difficultyInput);
    }

    estimatedTimeH = xss(req.body.estimatedTimeInputH);
    if (estimatedTimeH < 10) {
      estimatedTimeH = "0".concat(estimatedTimeH);
    }
    estimatedTimeM = xss(req.body.estimatedTimeInputM);
    if (estimatedTimeM < 10) {
      estimatedTimeM = "0".concat(estimatedTimeM);
    }
    estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");
    //console.log(estimatedTime);
    deadline = xss(req.body.deadlineInput);
    deadline = deadline.concat(":00.000Z");
    console.log(deadline);
    let systemOffset = new Date().getTimezoneOffset();
    let inputDate = new Date(deadline)
    let localDeadline = new Date(inputDate.getTime() - systemOffset * 60 * 1000);
    let utcDeadline = new Date(localDeadline.getTime() - systemOffset * 60 * 1000);
    deadline = utcDeadline.toISOString();
    description = req.body.descriptionInput;
    console.log(description);
    assignedTo = req.body.assignedToInput;
    console.log(assignedTo);
    assignedTo = assignedTo.split(",");

    try {

      /*
      validation.parameterCheck( taskName, estimatedTime, deadline, description, assignedTo);
      validation.strValidCheck(taskName, estimatedTime, description);
      taskName = helpers.checkTaskName(taskName);
      description = helpers.checkDescription(description);
      validation.validDateTimeFormatCheck(deadline);
      validation.arrayValidCheck(assignedTo);
      estimatedTime = helpers.convertEstimatedTimeToMs(estimatedTime);
      */

    } catch (e) {
      return res.render("error", { titley: "Error", err: e });
    }

    try {
      //boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      if (userGet.priorityScheduling) {
        addpriority = true;
        difficulty = null;
      }
      else {
        priority = null;
      }
      boardT = userGet.toDo;
      console.log(boardT);
      boardS = userGet.inProgress;
      boardD = userGet.done;

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }
    //create the task

    //check if identical task is already in database

    /*
    function checkTask(task){
      if ((taskName == task.taskName) 
        && (priority == task.priority) && (difficulty == task.difficulty) 
        && (estimatedTime == task.estimatedTime) && (deadline == task.deadline) 
        && (description == task.description) 
        && (assignedTo == task.assignedTo)) 
          { console.log("aggggg");};
        */
    /*
    try {
      
      boardT.forEach(checkTask);

    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    }
    */

    try {
      newTask = await taskData.createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }


    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      if (userGet.priorityScheduling) {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    //render the page again
    try {
      res.render("boards", { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }

  });

router.route("/update/:taskId")
  .patch(async (req, res) => {
    let boardT;
    let boardS;
    let boardD;
    let taskId = req.params.taskId;
    let board;
    let boardId;
    let taskName;
    let priority;
    let difficulty;
    let estimatedTimeH;
    let estimatedTimeM;
    let estimatedTime;
    let deadline;
    let description;
    let assignedTo;
    let userGet;
    let boardName;
    console.log(taskId);

    try {
      //get the taskId and get the board by the taskid 
      taskId = req.body.taskId;
      board = await taskData.getBoardByTaskId(taskId);
      boardId = board._id.toString();

      taskName = req.body.taskName;
      console.log(taskName);
      //if the priority input is null, make the priority null, else get the priority
      if (typeof (req.body.priority) === 'undefined') {
        priority = null;
        console.log("p", priority);
      }
      else {
        priority = req.body.priority;
        console.log("d", priority);
      }
      //if the difficulty input is null, make the difficulty null, else get the difficulty
      if (typeof (req.body.difficulty) === 'undefined') {
        difficulty = null;
      }
      else {
        difficulty = req.body.difficulty;
        console.log(difficulty);
      }


      estimatedTimeH = req.body.estimatedTimeH;
      if (estimatedTimeH < 10) {
        estimatedTimeH = "0".concat(estimatedTimeH);
      }
      estimatedTimeM = req.body.estimatedTimeM;
      if (estimatedTimeM < 10) {
        estimatedTimeM = "0".concat(estimatedTimeM);
      }
      console.log(estimatedTimeH);
      estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");
      console.log(estimatedTime);
      deadline = req.body.deadline;

      deadline = deadline.concat(":00.000Z");
      console.log(deadline);
      let systemOffset = new Date().getTimezoneOffset();
      let inputDate = new Date(deadline)
      let localDeadline = new Date(inputDate.getTime() - systemOffset * 60 * 1000);
      let utcDeadline = new Date(localDeadline.getTime() - systemOffset * 60 * 1000);
      deadline = utcDeadline.toISOString();
      description = req.body.description;
      console.log(description);
      assignedTo = req.body.assignedTo;
      console.log(assignedTo);
      assignedTo = assignedTo.split(",");


      //console.log(userGet);
      console.log("hi2")

    } catch (e) {
      console.log(e);
    }

    try {

      userGet = await boardData.getBoardById(boardId);

      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    try {
      let updatedTask = await taskData.updateTask(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
      console.log(updatedTask);
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      //console.log(userGet);
      console.log(userGet.priorityScheduling);
      if (userGet.priorityScheduling) {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    //render the page again
    try {
      res.render("boards", { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }


  });

console.log("0");
router.route("/delete/:taskId")
  .delete(async (req, res) => {
    console.log("1");
    let boardT;
    let boardS;
    let boardD;
    let taskId = req.params.taskId;
    let boardId;
    let userGet;
    try {
      console.log("2");
      const board = await taskData.getBoardByTaskId(taskId);
      boardId = board._id.toString();
      console.log("board ID:", boardId);
    } catch (e) {
      console.log(e);
    }
    try {
      console.log("3");
      //boardId = req.params.id;
      console.log(boardId);
      userGet = await boardData.getBoardById(boardId);
      //console.log(userGet);
      console.log("hi2")
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    try {
      console.log("4");
      await taskData.deleteTask(taskId);
      console.log("task deleted!")

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      //console.log(userGet);
      console.log(userGet.priorityScheduling);
      if (userGet.priorityScheduling) {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    //render the page again
    try {
      res.render("boards", { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
  });

router.route("/checklist/:taskId")
  .post(async (req, res) => {
    const taskId = req.params.taskId;
    let username = req.session.user.username;
    try {
      await checkListData.addTaskToCheckList(taskId, username);
    } catch (e) {
      console.log(e);
    }
  });
router.route("/todo/:taskId")
  .post(async (req, res) => {
    const taskId = req.params.taskId;
    try {
      await taskData.moveToToDo(taskId);
    } catch (e) {
      console.log(e);
    }
  });
router.route("/inprogress/:taskId")
  .post(async (req, res) => {
    const taskId = req.params.taskId;
    try {
      await taskData.moveToInProgress(taskId);
    } catch (e) {
      console.log(e);
    }
  });
router.route("/done/:taskId")
  .post(async (req, res) => {
    const taskId = req.params.taskId;
    try {
      await taskData.moveToDone(taskId);
    } catch (e) {
      console.log(e);
    }
  });

export default router;

