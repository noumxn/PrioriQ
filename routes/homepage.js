import {Router} from 'express';
const router = Router();
//add whatever imports you need

import {boardData, checkListData, taskData} from "../data/index.js";
import helpers from "../data/helpers.js"
import validation from '../utils/validation.js';
import bcrypt from 'bcryptjs';
import xss from 'xss';

router.route('/')
  .get( async (req, res) => {
    let userBoards = undefined;
    let sharedBoardIDs = undefined;
    let userChecklist = undefined;
    let username = undefined;
    let sharedBoards = [];
    try {
      username = req.session.user.username;
      userBoards = await boardData.getBoardsByUser(username);
      sharedBoardIDs = req.session.user.sharedBoards;
      await checkListData.deleteTasksFromCheckList(username);
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.render("error", { titley:"Error", err: e.message });
    }
    try {
      for (let i = 0; i < sharedBoardIDs.length; i++) {
        sharedBoards.push(await boardData.getBoardById(sharedBoardIDs[i]));
      }
    } catch (e) {
      return res.render("error", { titley:"Error", err: e.message });
    }

    try {
        return res.render("homepage", { titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards});
      } catch (e) {
        res.status(500).json({ error: e });
      }

  })
  .post(async (req, res) => {
    let userBoards = undefined;
    let sharedBoardIDs = undefined;
    let userChecklist = undefined;
    let username = undefined;
    let sharedBoards = [];
    try {
      username = req.session.user.username;
      userBoards = await boardData.getBoardsByUser(username);
      sharedBoardIDs = req.session.user.sharedBoards;
      await checkListData.deleteTasksFromCheckList(username);
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.render("error", { titley:"Error", err: e.message });
    }
    try {
      for (let i = 0; i < sharedBoardIDs.length; i++) {
        sharedBoards.push(await boardData.getBoardById(sharedBoardIDs[i]));
      }
    } catch (e) {
      return res.render("error", { titley:"Error", err: e.message });
    }

    let boardName = undefined;
    let boardPassword = undefined;
    let confirmPassword = undefined;
    let priorityScheduling = undefined;
    let owner = undefined;
    let newBoard = undefined;
    let sortOrder = undefined;

    //Confirm password in auth.js not being checked
    try {
      boardName = helpers.checkName(xss(req.body.boardNameInput));
      boardPassword = xss(req.body.boardPasswordInput);
      helpers.checkPassword(boardPassword);
      confirmPassword = xss(req.body.boardConfirmPasswordInput);
      helpers.checkPassword(confirmPassword);
      priorityScheduling = helpers.checkPriorityScheduling(xss(req.body.sortingInput));
      //console.log(priorityScheduling);
      owner = helpers.checkUsername(req.session.user.username);
      sortOrder = helpers.checkSortOrderValue(priorityScheduling, xss(req.body.sortOrderInput));

    } catch (e) {
      return res.status(e.status).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:e.message});
    }
    if (boardPassword != confirmPassword) {
      return res.status(400).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:"Password and confirm password inputs do not match"});
    }
    try {
      newBoard = await boardData.createBoard(boardName, owner, priorityScheduling, sortOrder, boardPassword);
      return res.redirect('/');
    } catch (e) {
      return res.status(e.status).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:e.message});
    }

  });

router.route('/checklist/:taskId')
  .post( async (req, res) => {
    let username = undefined;
    let taskId = undefined;
    let checklist = undefined;

    try {
      username = req.session.user.username;
      taskId = req.params.taskId;
      checklist = await checkListData.getCheckListByUsername(username);
      await taskData.moveToDone(taskId);
      await checkListData.completeCheckListItem(taskId, username);
    } catch (e) {
      return res.status(e.status).render("error", { titley:"Error", err: e.message });
    }
    return res.redirect('/');
  });

router.route('/searchresult')
  .post( async (req, res) => {
    let userBoards = undefined;
    let sharedBoardIDs = undefined;
    let userChecklist = undefined;
    let username = undefined;
    let sharedBoards = [];
    try {
      username = req.session.user.username;
      userBoards = await boardData.getBoardsByUser(username);
      sharedBoardIDs = req.session.user.sharedBoards;
      await checkListData.deleteTasksFromCheckList(username);
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.status(e.status).render("error", { titley:"Error", err: e.message });
    }
    try {
      for (let i = 0; i < sharedBoardIDs.length; i++) {
        sharedBoards.push(await boardData.getBoardById(sharedBoardIDs[i]));
      }
    } catch (e) {
      return res.status(e.status).render("error", { titley:"Error", err: e.message });
    }

    const boardId = xss(req.body.searchBoardIdInput);
    const password = xss(req.body.searchBoardPasswordInput);
    let board = undefined;
    try {
      board = await boardData.getBoardById(boardId);
    } catch (e) {
      return res.status(e.status).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:e.message});
    }
    //EXTRA FEATURE - block users from board
    if (board.blockedUsers.includes(username)) {
      return res.status(401).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:"You may not join this board."});
    }
    if (board.allowedUsers.includes(username)) {
      return res.status(403).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:"You already joined this board."});
    }
    const hashedPassword = board.boardPassword;
    let match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      try {
        await boardData.AddUserAllowedUsers(boardId, username);
          req.session.user.sharedBoards.push(boardId);
          return res.redirect('/');
      } catch (e) {
        return res.status(e.status).render("error", { titley:"Error", err: e.message });
      }
    }
    else {
      return res.status(403).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:"Incorrect board password"});
    }
  });

export default router;