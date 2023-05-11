import { Router } from 'express';
import xss from 'xss';
import boardData from '../data/boards.js';
import helpers from '../data/helpers.js';
import validation from '../utils/validation.js';
const router = Router();

router.route("/").get(async (req, res) => {
  return res.status(400).render("../views/error", { e: 'Please input the id of the board you wish to access in the url' });
});

router
  .route('/:boardId')
  .get(async (req, res) => {
    let currentUser = req.session.user;
    let boardId = xss(req.params.boardId);
    let boardGet;
    let sortOrder;
    try {
      boardGet = await boardData.getBoardById(boardId);
    } catch (e) {
      return res.status(e.status).render("../views/error", { e: e.message });
    }
    if (boardGet.owner !== currentUser.username) {
      return res.status(403).render("../views/error", { e: `Only the board owner can access the board settings.` });
    }
    let flag;
    if (boardGet.priorityScheduling === "false") {
      flag = true;
      return res.status(200).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: boardGet.sortOrder, name: boardGet.boardName, boardId: boardId });
    } else {
      flag = false;
      return res.status(200).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, name: boardGet.boardName, boardId: boardId });
    }
  })
  .post(async (req, res) => {
    let boardId = xss(req.params.boardId);
    let board;
    try {
      boardId = validation.idCheck(boardId);
      board = await boardData.getBoardById(boardId);
    } catch {
      return res.status(401).render("../views/error", { e: `Board with that ID does not exist` });
    }
    let name = xss(req.body.boardNameInput);
    let sortOrder, flag;
    if (board.priorityScheduling === "false") {
      sortOrder = xss(req.body.sortOrderInput);
      flag = true;
    } else {
      sortOrder = "null";
      flag = false;
    }
    let password = xss(req.body.boardPasswordInput);
    let confirm = xss(req.body.confirmBoardPasswordInput);
    try {
      validation.parameterCheck(boardId, name, sortOrder, password);
      validation.strValidCheck(boardId, name, sortOrder, password);
      boardId = validation.idCheck(boardId);
      if (name.length > 30) {
        throw `Board Name must be less than 30 characters.`;
      }
      if (sortOrder !== 'asc' && sortOrder !== 'desc' && sortOrder !== 'null') {
        throw `Sort Order must be equal to asc, desc, or null.`;
      }
      helpers.checkPassword(password);
      if (password !== confirm) {
        throw `Password and confirm password must match`;
      }
    } catch (e) {
      return res.status(400).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e.message });
    }
    try {
      let updatedBoard = await boardData.updateBoard(boardId, name, sortOrder, password);
      res.redirect("/boards/" + boardId);
    } catch (e) {
      return res.status(e.status).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e.message });
    }
  })

router.route("/delete/:boardId")
  .get(async (req, res) => {
    let boardId = xss(req.params.boardId);
    return res.redirect("/boardsettings/" + boardId);
  })
  .post(async (req, res) => {
    let boardId = xss(req.params.boardId);
    let board;
    try {
      boardId = validation.idCheck(boardId);
      board = await boardData.getBoardById(boardId);
    } catch (e) {
      return res.status(e.status).render("../views/error", { titley: "Board Settings", e: `No board with that ID` });
    }
    try {
      validation.parameterCheck(boardId);
      validation.strValidCheck(boardId);
      boardId = validation.idCheck(boardId);
    } catch (e) {
      return res.status(e.status).render("../views/boardSettings", { titley: "Board Settings", error: true, e: e.message });
    }
    try {
      let data = await boardData.deleteBoard(boardId);
      res.redirect("/homepage");
    } catch (e) {
      return res.status(e.status).render("../views/boardSettings", { titley: "Board Settings", sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e.message });
    }
  })

//EXTRA FEATURE - BLOCK USER FROM BOARD
router.route("/blockUser/:boardId")
  .get(async (req, res) => {
    let boardId = xss(req.params.boardId);
    return res.redirect("/boardsettings/" + boardId);
  })
  .post(async (req, res) => {
    let board, blockedUser;
    let boardId = xss(req.params.boardId);
    blockedUser = xss(req.body.blockUserInput);
    try {
      boardId = validation.idCheck(boardId);
      board = await boardData.getBoardById(boardId);
    } catch {
      res.status(401).render("../views/error", { e: `Board with that ID does not exist` });
    }
    let flag;
    if (board.priorityScheduling === 'false') {
      flag = true;
    } else {
      flag = false;
    }
    try {
      validation.parameterCheck(blockedUser);
      validation.strValidCheck(blockedUser);
      blockedUser = helpers.checkUsername(blockedUser);
    } catch (e) {
      return res.status(e.status).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e.message });
    }
    try {
      if (blockedUser === board.owner) {
        throw `You cannot block the owner of the board`;
      }
    } catch (e) {
      return res.status(403).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e });
    }
    try {
      let newBoard = boardData.AddUserBlockedUsers(boardId, blockedUser);
      return res.status(200).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, blocked: blockedUser });
    } catch (e) {
      return res.status(e.status).render("../views/boardSettings", { titley: "Board Settings", sortBool: flag, sort: board.sortOrder, name: board.boardName, boardId: boardId, error: true, e: e.message });
    }
  })

export default router;