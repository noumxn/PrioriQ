//import axios from "axios";
import { Router, application } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData, taskData} from "../data/index.js";
import {userData} from "../data/index.js";
import validation from "../utils/validation.js";
let addpriority = undefined;


router.route("/:id")
  .get( async (req, res) => {
    let boardId;
    let userGet;
    let b1;
    let boardT;
    let boardS;
    let boardD;
    try {
      addpriority = false;
      boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      console.log("hi1");
      console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling){
        addpriority = true;
      } else {
        addpriority = false;
      }
      console.log("priority: ", addpriority);
      boardT = userGet.toDo;
      console.log(boardT);
      boardS = userGet.inProgress;
      boardD = userGet.done;
    
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:true,  error: true, e:e.message});
    }
    try {
      return res.render("boards", { titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
      } catch (e) {
        return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, addpriority:addpriority, e:e.message});
      }

  })
  .post(async (req, res) => {
    console.log('I got herex');
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

      boardId = req.params.id;
      console.log(boardId);
      taskName = req.body.taskNameInput;
      console.log(taskName);
      if(typeof(req.body.priorityInput) === 'undefined'){
        priority = null;
        console.log(priority);
      }
      else{
        priority = req.body.priorityInput;
        console.log(priority);
      }
      if(typeof(req.body.difficultyInput) === 'undefined'){
        difficulty = null;
      }
      else{
        difficulty = req.body.difficultyInput;
        console.log(difficulty);
      }

      estimatedTimeH = req.body.estimatedTimeInputH;
      if(estimatedTimeH < 10){
        estimatedTimeH = "0".concat(estimatedTimeH);
      }
      estimatedTimeM = req.body.estimatedTimeInputM;
      if(estimatedTimeM < 10){
        estimatedTimeM = "0".concat(estimatedTimeM);
      }
      estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");
      console.log(estimatedTime);
      deadline = req.body.deadlineInput;
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

    try{

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
      console.log('I got herey');
      return res.render("error", { titley:"Error page", err: e });
    }

    try {
      //boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      //console.log(userGet);
      console.log("hi2")
      console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling){
        addpriority = true;
        difficulty = null;
      }
      else{
        priority = null;
      }
      boardT = userGet.toDo;
      console.log(boardT);
      boardS = userGet.inProgress;
      boardD = userGet.done;
    
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
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
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    }
    */

    try {
      newTask = await taskData.createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
      console.dir(newTask, {depth:null});
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority, error: true, e:e.message});
    }


    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      //console.log(userGet);
      console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling){
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.done;
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    } 
    //render the page again
    try {
      res.render("boards", { titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
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
    console.log(taskId);

    try {
      //boardId = req.params.id;

      board = await taskData.getBoardByTaskId(taskId);
      boardId = board._id.toString();

      taskName = req.body.newTaskNameInput;
      console.log(taskName);
      if(typeof(req.body.newPriorityInput) === 'undefined'){
        priority = null;
        console.log(priority);
      }
      else{
        priority = req.body.newPriorityInput;
        console.log(priority);
      }
      if(typeof(req.body.newDifficultyInput) === 'undefined'){
        difficulty = null;
      }
      else{
        difficulty = req.body.newDifficultyInput;
        console.log(difficulty);
      }


      estimatedTimeH = req.body.newEstimatedTimeInputH;
      if(estimatedTimeH < 10){
        estimatedTimeH = "0".concat(estimatedTimeH);
      }
      estimatedTimeM = req.body.newEstimatedTimeInputM;
      if(estimatedTimeM < 10){
        estimatedTimeM = "0".concat(estimatedTimeM);
      }
      console.log(estimatedTimeH);
      estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");
      console.log(estimatedTime);
      deadline = req.body.newDeadlineInput;

      deadline = deadline.concat(":00.000Z");
      console.log(deadline);
      let systemOffset = new Date().getTimezoneOffset();
      let inputDate = new Date(deadline)
      let localDeadline = new Date(inputDate.getTime() - systemOffset * 60 * 1000);
      let utcDeadline = new Date(localDeadline.getTime() - systemOffset * 60 * 1000);
      deadline = utcDeadline.toISOString();
      description = req.body.newDescriptionInput;
      console.log(description);
      assignedTo = req.body.newAssignedToInput;
      console.log(assignedTo);
      assignedTo = assignedTo.split(",");

      
      //console.log(userGet);
      console.log("hi2")

    } catch (e) {
      console.log(e);
    }

  try{

    userGet = await boardData.getBoardById(boardId);

    boardT = userGet.toDo;
    boardS = userGet.inProgress;
    boardD = userGet.done;
    
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
    }

    try{
      let updatedTask = await taskData.updateTask(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
      console.log(updatedTask);
    } catch (e){
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
    }

    //get the boards again
    try {
         userGet = await boardData.getBoardById(boardId);
          //console.log(userGet);
          console.log(userGet.priorityScheduling);
          if(userGet.priorityScheduling){
            addpriority = true;
          }
          boardT = userGet.toDo;
          boardS = userGet.inProgress;
          boardD = userGet.done;
      } catch (e) {
          return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
      } 
        //render the page again
    try {
          res.render("boards", { titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
        } catch (e) {
          return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
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
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
    }

    try{
      console.log("4");
      await taskData.deleteTask(taskId);
      console.log("task deleted!")

    } catch (e){
      return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
    }

    //get the boards again
        try {
          userGet = await boardData.getBoardById(boardId);
          //console.log(userGet);
          console.log(userGet.priorityScheduling);
          if(userGet.priorityScheduling){
            addpriority = true;
          }
          boardT = userGet.toDo;
          boardS = userGet.inProgress;
          boardD = userGet.done;
        } catch (e) {
          return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
        } 
        //render the page again
        try {
          res.render("boards", { titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
        } catch (e) {
          return res.status(400).render('../views/boards', {titley: "Board page", boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
        }
  });

export default router;

