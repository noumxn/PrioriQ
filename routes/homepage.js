import {Router} from 'express';
const router = Router();
//add whatever imports you need

import {boardData, checkListData} from "../data/index.js";
import helpers from "../data/helpers.js"
import validation from '../utils/validation.js';

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
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e.message });
    }
    try {
      for (let i = 0; i < sharedBoardIDs.length; i++) {
        sharedBoards.push(await boardData.getBoardById(sharedBoardIDs[i]));
      }
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e.message });
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
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e.message });
    }
    try {
      for (let i = 0; i < sharedBoardIDs.length; i++) {
        sharedBoards.push(await boardData.getBoardById(sharedBoardIDs[i]));
      }
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e.message });
    }

    let boardName = undefined;
    let boardPassword = undefined;
    let confirmPassword = undefined;
    let priorityScheduling = undefined;
    let owner = undefined;
    let newBoard = undefined;
    let sortOrder = undefined;

    //Should board passwords require special characters?
    //Confirm password in auth.js not being checked
    try {
      boardName = helpers.checkName(req.body.boardNameInput);
      boardPassword = req.body.boardPasswordInput;
      helpers.checkPassword(boardPassword);
      confirmPassword = req.body.boardConfirmPasswordInput;
      helpers.checkPassword(confirmPassword);
      priorityScheduling = helpers.checkPriorityScheduling(req.body.sortingInput);
      owner = helpers.checkUsername(req.session.user.username);
      sortOrder = helpers.checkSortOrderValue(priorityScheduling, req.body.sortOrderInput);

    } catch (e) {
      return res.status(400).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:e.message});
     // return res.render("error", { titley:"Error page", err: e });
    }
    if (boardPassword != confirmPassword) {
      return res.status(400).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:"Password and confirm password inputs do not match"})
     // return res.render("error", { titley:"Error page", err: "Password and confirm password inputs do not match" });
    }
    /**
    try {
      validation.strValidCheck(boardName);
      validation.strValidCheck(boardPassword);
      validation.strValidCheck(confirmPassword);
      validation.strValidCheck(owner);
      validation.strValidCheck(sortOrder);
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e });
    }
    */
    try {
      newBoard = await boardData.createBoard(boardName, owner, priorityScheduling, sortOrder, boardPassword);
      return res.redirect('/');
    } catch (e) {
      return res.status(400).render("../views/homepage", {titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist, sharedBoards: sharedBoards, error:true, e:e.message});
    }

  });

export default router;