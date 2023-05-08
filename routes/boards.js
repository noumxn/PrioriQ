//import axios from "axios";
import { Router } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData, taskData} from "../data/index.js";
import {userData} from "../data/index.js";
import validation from "../utils/validation.js";
import xss from 'xss';


router.route("/").get(async (req,res) => {
  return res.status(400).render("../views/error", {err: 'Please input the id of the board you wish to access in the url'});
})


router.route("/:id")
  .get( async (req, res) => {
    let boardId;
    let userGet;
    let boardT;
    let boardS;
    let boardD;
    let b1;
    let addpriority;
    let boardName;
    let username;
    try {
      addpriority = false;
      username = req.session.user.username;
      boardId = req.params.id;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      //console.log("Priority scheduling is now");
      //console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling =="true"){
        addpriority = true;
      }
      //console.log("Hello")
      //console.log(addpriority);
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.Done;
    
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:true,  error: true, e:e.message});
    }
    if (userGet.blockedUsers.includes(username)) {
      return res.status(401).render("error", { titley: "Error", err:"You may not join this board."});
    }
    if (!userGet.allowedUsers.includes(username)) {
      return res.status(403).render("error", { titley:"Error", err:"You have not joined this board."});
    }
    try {
      return res.render("boards", { titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
      } catch (e) {
        return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, addpriority:addpriority, e:e.message});
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
    let boardT;
    let boardS;
    let boardD;
    let addpriority;
    let userGet;
    let boardName;

      boardId = req.params.id;
      //console.log(boardId);
      taskName = xss(req.body.taskNameInput);
      if(typeof(xss(req.body.priorityInput)) === 'undefined'){
        priority = null;
      }
      else{
        priority = xss(req.body.priorityInput);
      }
      if(typeof(xss(req.body.difficultyInput)) === 'undefined'){
        difficulty = null;
      }
      else{
        difficulty = xss(req.body.difficultyInput);
      }

      estimatedTimeH = xss(req.body.estimatedTimeInputH);
      if(estimatedTimeH < 10){
        estimatedTimeH = "0".concat(estimatedTimeH);
      }
      estimatedTimeM = xss(req.body.estimatedTimeInputM);
      if(estimatedTimeM < 10){
        estimatedTimeM = "0".concat(estimatedTimeM);
      }
      estimatedTime = estimatedTimeH.concat(" hours ", estimatedTimeM, " mins");
      //console.log(estimatedTime);
      deadline = xss(req.body.deadlineInput);
      deadline = deadline.concat(":00.000Z");
      //console.log(deadline);
      description = xss(req.body.descriptionInput);
      //console.log(description);
      assignedTo = xss(req.body.assignedToInput);
      //console.log(assignedTo);
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
      //console.log('I got herey');
      return res.render("error", { titley:"Error", err: e });
    }

    try {
      addpriority = false;
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      //console.log(userGet);
      //console.log("hi2")
      //console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling){
        addpriority = true;
        difficulty = null;
      }
      else{
        priority = null;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.Done;
    
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
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
     // console.dir(newTask, {depth:null});
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority, error: true, e:e.message});
    }


    //get the boards again
    try {
      userGet = await boardData.getBoardById(boardId);
      boardName = userGet.boardName;
      //console.log(userGet);

      if(userGet.priorityScheduling){
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.Done;
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    } 
    //render the page again
    try {
      res.render("boards", { titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
    } catch (e) {
      return res.status(400).render('../views/boards', {titley: boardName, boardId:boardId, boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    }

  });

export default router;

