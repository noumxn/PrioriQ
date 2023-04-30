import {Router} from 'express';
const router = Router();
//add whatever imports you need

import {boardData, checkListData} from "../data/index.js";

router.route('/')
  .get( async (req, res) => {
    let userBoards = undefined;
    let userChecklist = undefined;
    let username = undefined;
    try {
      username = req.session.user.username;
      userBoards = await boardData.getBoardsByUser(username);
      userChecklist = await checkListData.getCheckListByUsername(username);
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e.message });
    }

    try {
        res.render("homepage", { titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist});
      } catch (e) {
        res.status(500).json({ error: e });
      }

  })
  .post(async (req, res) => {
    let boardName = undefined;
    let boardPassword = undefined;
    let confirmPassword = undefined;
    let priorityScheduling = undefined;
    let owner = undefined;
    let newBoard = undefined;
    let sortOrder = undefined;
    //TODO: Input validation
    try {
      boardName = req.body.boardNameInput;
      boardPassword = req.body.boardPasswordInput;
      confirmPassword = req.body.boardConfirmPasswordInput;
      priorityScheduling = req.body.sortingInput;
      owner = req.session.user.username;
      sortOrder = req.body.sortOrderInput;
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e });
    }
    try {
      newBoard = await boardData.createBoard(boardName, owner, priorityScheduling, sortOrder, boardPassword);
      return res.redirect('/');
    } catch (e) {
      return res.status(400).render("../views/homepage", {titley: "Homepage",error:true, e:e.message});
    }

  });

export default router;