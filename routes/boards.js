//import axios from "axios";
import { Router } from "express";
import xss from 'xss';
import helpers from '../data/helpers.js';
import validation from "../utils/validation.js";
const router = Router();

import { boardData, checkListData, taskData } from "../data/index.js";
let addpriority = undefined;

router.route("/").get(async (req, res) => {
  return res.status(400).render("../views/error", { e: 'Please input the id of the board you wish to access in the url' });
})

router.route("/:id")
  .get(async (req, res) => {
    let boardId;
    let userGet;
    let boardT;
    let boardS;
    let boardD;
    let boardName;
    let username;
    boardId = req.params.id;
    try {
      username = req.session.user.username;
      boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      if (userGet.priorityScheduling === "true") {
        addpriority = true;
      } else {
        addpriority = false;
      }
      function formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hours ${minutes} minutes`;
      }
      for (let task in userGet.toDo) {
        userGet.toDo[task].deadline = new Date(userGet.toDo[task].deadline).toUTCString();
        userGet.toDo[task].estimatedTime = formatTime(userGet.toDo[task].estimatedTime);
      }
      for (let task in userGet.inProgress) {
        userGet.inProgress[task].deadline = new Date(userGet.inProgress[task].deadline).toUTCString()
        userGet.inProgress[task].estimatedTime = formatTime(userGet.inProgress[task].estimatedTime);
      }
      for (let task in userGet.done) {
        userGet.done[task].deadline = new Date(userGet.done[task].deadline).toUTCString()
        userGet.done[task].estimatedTime = formatTime(userGet.done[task].estimatedTime);
      }

      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
     // console.log(boardT);

     // for (let i = 0; i < boardT.length; i++) {
      //  boardT[i].description = helpers.anchorLinks(boardT[i]);
    //  }
//
      //boardT.forEach(helpers.anchorLinks);
    //  console.log(boardT);
      //boardS.forEach(helpers.anchorLinks);
     // boardD.forEach(helpers.anchorLinks);

    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: true, error: true, e: e });
    }
    if (userGet.blockedUsers.includes(username)) {
      return res.status(401).render("error", { titley: "Error", e: "You may not join this board." });
    }
    if (!userGet.allowedUsers.includes(username)) {
      return res.status(403).render("error", { titley: "Error", e: "You have not joined this board." });
    }
    try {
      return res.render("boards", { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, addpriority: addpriority, e: e.message });
    }

  })
  .post(async (req, res) => {
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
    let timezoneOffset;
    let timezoneOffsetMs;
    let inputDate;
    let utcDate;
    let utcDateString;

    //first, we get the board by the boardId
    try {
      boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      if (userGet.priorityScheduling === "true") {
        addpriority = true;
        difficulty = null;
      }
      else {
        priority = null;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;

    } catch (e) {
      // console.log(e.status);
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e });
    }


    //here, we get all the form data
    try {
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
      deadline = xss(req.body.deadlineInput);
      deadline = deadline.concat(":00.000Z");
      timezoneOffset = new Date().getTimezoneOffset();
      timezoneOffsetMs = timezoneOffset * 60 * 1000;
      inputDate = new Date(deadline);
      utcDate = new Date(inputDate.getTime() + timezoneOffsetMs);
      utcDateString = utcDate.toISOString();
      deadline = utcDateString;
      description = xss(req.body.descriptionInput);
      assignedTo = xss(req.body.assignedToInput);
      if (assignedTo === "") {
        assignedTo = [];
      }
      else {
        assignedTo = assignedTo.split(",");
      }
      if (assignedTo.length < 1) {
        assignedTo.push(userGet.owner);
      }
      
    } catch (e) {
      return res.status(400).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: "Invalid input" });
    }

    //we do some more validation here
    try {
      validation.parameterCheck(taskName, estimatedTime, deadline, description, assignedTo);
      validation.strValidCheck(taskName, estimatedTime, description);
      taskName = helpers.checkTaskName(taskName);
      description = helpers.checkDescription(description);
      validation.validDateTimeFormatCheck(deadline);
      validation.arrayValidCheck(assignedTo);
    } catch (e) {
      return res.status(e.status).render("error", { titley: "Error", e: e.message });
    }

    //create the task
    try {
      newTask = await taskData.createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    //get the board again
    try {
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      if (userGet.priorityScheduling === "true") {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    try {
      res.render("boards", { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }

  });

router.route("/update/:taskId")
  .post(async (req, res) => {
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
    let addpriority

    try {
      //get the taskId and get the board by the taskid 
      taskId = xss(req.body.taskId);
      board = await taskData.getBoardByTaskId(taskId);
      boardId = board._id.toString();


      if (board.priorityScheduling) {
        addpriority = true;
      }
      else {
        addpriority = false;
      }

      boardT = board.toDo;
      boardS = board.inProgress;
      boardD = board.done;
    } catch (e) {
      return res.status(e.status).render("error", { titley: "Error", e: e.message });
    }


    try {
      taskName = xss(req.body.taskName);
      estimatedTimeH = xss(req.body.estimatedTimeH);
      estimatedTimeM = xss(req.body.estimatedTimeM);
      deadline = xss(req.body.deadline);
      description = xss(req.body.description);

      validation.parameterCheck(taskName, estimatedTimeH, estimatedTimeM, deadline, description);
      validation.strValidCheck(taskName, description);

      //if the priority input is null, make the priority null, else get the priority
      if (typeof (xss(req.body.priority)) === 'undefined') {
        priority = null;
      }
      else {
        priority = xss(req.body.priority);
      }
      //if the difficulty input is null, make the difficulty null, else get the difficulty
      if (typeof (xss(req.body.difficulty)) === 'undefined') {
        difficulty = null;
      }
      else {
        difficulty = xss(req.body.difficulty);
      }

      validation.parameterCheck(estimatedTimeH);
      if (estimatedTimeH < 10) {
        estimatedTimeH = "0".concat(estimatedTimeH);
      }

      if (estimatedTimeM < 10) {
        estimatedTimeM = "0".concat(estimatedTimeM);
      }
      estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");

      deadline = deadline.concat(":00.000Z");
      console.log("Updated deadline: ", deadline);
      let systemOffset = new Date().getTimezoneOffset();
      let inputDate = new Date(deadline)
      let localDeadline = new Date(inputDate.getTime() - systemOffset * 60 * 1000);
      let utcDeadline = new Date(localDeadline.getTime() - systemOffset * 60 * 1000);
      deadline = utcDeadline.toISOString();

      assignedTo = xss(req.body.assignedTo);
      if (assignedTo === "") {
        assignedTo = [];
      }
      else {
        assignedTo = assignedTo.split(",");
      }
      if (assignedTo.length < 1) {
        assignedTo.push(board.owner);
      }

    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    try {
      userGet = await boardData.getBoardById(boardId);
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    try {
      let updatedTask = await taskData.updateTask(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      if (userGet.priorityScheduling === "true") {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    //render the page again
    try {
      return res.render("boards", { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
  });

router.route("/delete/:taskId")
  .delete(async (req, res) => {
    let boardT;
    let boardS;
    let boardD;
    let taskId = req.params.taskId;
    let boardId;
    let userGet;
    try {
      const board = await taskData.getBoardByTaskId(taskId);
      boardId = board._id.toString();
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }
    try {
      userGet = await boardData.getBoardById(boardId);
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    try {
      await taskData.deleteTask(taskId);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority, error: true, e: e.message });
    }

    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      if (userGet.priorityScheduling === "true") {
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
    //render the page again
    //TODO - added return here
    try {
      return res.render("boards", { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, addpriority: addpriority });
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: "Board page", boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, e: e.message });
    }
  });

router.route("/checklist/:taskId")
  .post(async (req, res) => {
    const taskId = req.params.taskId;
    let username = req.session.user.username;
    let duplicate = false;
    let checkList = undefined;
    try {
      checkList = await checkListData.getCheckListByUsername(username);
      for (let i = 0; i < checkList.length; i++) {
        if (checkList[i].taskId === taskId) {
          duplicate = true;
          break;
        }
      }
      if (!duplicate) {
        await checkListData.addTaskToCheckList(taskId, username);
      }
    } catch (e) {
      return res.status(e.status).render('error', { titley: "Error", error: true, e: e.message })
    }
  });

router.route("/todo/:taskId")
  .post(async (req, res) => {
    let boardId;
    let boardT;
    let boardS;
    let boardD;
    let boardName;
    let addpriority = false;
    const taskId = req.params.taskId;
    try {
      await taskData.moveToToDo(taskId);
      let board = await taskData.getBoardByTaskId(taskId);
      const boardId = board._id;
      boardName = board.boardName;
      if (board.priorityScheduling === "true") {
        addpriority = true;
      } else {
        addpriority = false;
      }
      boardT = board.toDo;
      boardS = board.inProgress;
      boardD = board.done;
      const boardIdStr = boardId.toString();

      return res.redirect(`/boards/${boardIdStr}`);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, addpriority: addpriority, e: e.message });
    }
  });

router.route("/inprogress/:taskId")
  .post(async (req, res) => {
    let boardId;
    let boardT;
    let boardS;
    let boardD;
    let boardName;
    let addpriority = false;
    const taskId = req.params.taskId;
    try {
      await taskData.moveToInProgress(taskId);
      let board = await taskData.getBoardByTaskId(taskId);
      const boardId = board._id;
      boardName = board.boardName;
      if (board.priorityScheduling === "true") {
        addpriority = true;
      } else {
        addpriority = false;
      }
      boardT = board.toDo;
      boardS = board.inProgress;
      boardD = board.done;
      const boardIdStr = boardId.toString();

      return res.redirect(`/boards/${boardIdStr}`);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, addpriority: addpriority, e: e.message });
    }
  });

router.route("/done/:taskId")
  .post(async (req, res) => {
    let boardId;
    let boardT;
    let boardS;
    let boardD;
    let boardName;
    let addpriority = false;
    let boardIdStr;
    const taskId = req.params.taskId;
    try {
      await taskData.moveToDone(taskId);
      let board = await taskData.getBoardByTaskId(taskId);
      const boardId = board._id;
      boardName = board.boardName;
      if (board.priorityScheduling === "true") {
        addpriority = true;
      } else {
        addpriority = false;
      }
      boardT = board.toDo;
      boardS = board.inProgress;
      boardD = board.done;
      boardIdStr = boardId.toString();
      return res.redirect(`/boards/${boardIdStr}`);
    } catch (e) {
      return res.status(e.status).render('../views/boards', { titley: boardName, boardId: boardId, boardTodo: boardT, boardProgress: boardS, boardDone: boardD, error: true, addpriority: addpriority, e: e.message });
    }
  });

export default router;

