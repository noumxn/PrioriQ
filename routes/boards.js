//import axios from "axios";
import { Router } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData, taskData} from "../data/index.js";
import {userData} from "../data/index.js";


router.route("/:id")
  .get( async (req, res) => {
    let boardId1;
    let userGet;
    let boardT;
    let boardS;
    let boardD;
    let b1;
    let addpriority;
    try {
      addpriority = false;
      boardId1 = req.params.id;
      userGet = await boardData.getBoardById(boardId1);
      //console.log(userGet);
      console.log(userGet.priorityScheduling);
      if(userGet.priorityScheduling){
        addpriority = true;
      }
      boardT = userGet.toDo;
      boardS = userGet.inProgress;
      boardD = userGet.Done;
    
    } catch (e) {
      res.status(400).render('../views/boards', {titley: "Board page", boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority,  error: true, e:e.message});
    }
    try {
        res.render("boards", { titley: "Board page", boardTodo:boardT, boardProgress:boardS, boardDone:boardD, addpriority:addpriority});
      } catch (e) {
        res.status(400).render('../views/boards', {titley: "Board page", boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, addpriority:addpriority, e:e.message});
      }

  })
  .post(async (req, res) => {
    console.log('I got herex');
    let boardId;
    let taskName;
    let priority;
    let difficulty;
    let estimatedTime;
    let deadline;
    let description;
    let assignedTo;
    let newTask;

      boardId = req.params.id;
      taskName = req.body.taskNameInput;
      priority = req.body.priorityInput;
      difficulty = req.body.difficultyInput;
      estimatedTime = req.body.estimatedTimeInput;
      deadline = req.body.deadlineInput;
      description = req.body.descriptionInput;
      assignedTo = req.body.assignedToInput;

    try{

      validation.parameterCheck( taskName, estimatedTime, deadline, description, assignedTo);
      validation.strValidCheck(taskName, estimatedTime, description);
      taskName = helpers.checkTaskName(taskName);
      description = helpers.checkDescription(description);
      validation.validDateTimeFormatCheck(deadline);
      validation.arrayValidCheck(assignedTo);
      estimatedTime = helpers.convertEstimatedTimeToMs(estimatedTime);

    } catch (e) {
      console.log('I got herey');
      return res.render("error", { titley:"Error page", err: e });
    }

    try {
      newTask = await taskData.createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
      console.log("hi");
      res.redirect("/homepage");
    } catch (e) {
      res.status(400).render('../views/boards', {titley: "Board page", boardTodo:boardT, boardProgress:boardS, boardDone:boardD, error: true, e:e.message});
    }

  });

export default router;

