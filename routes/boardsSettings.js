import {Router} from 'express';
const router = Router();
import boardData from '../data/boards.js'
import helpers from '../data/helpers.js';
import validation from '../utils/validation.js';
import xss from 'xss';

router.route("/").get(async (req,res) => {
  return res.status(400).render("../views/error", {err: 'Please input the id of the board you wish to access in the url'});
});

router
  .route('/:boardId')
  .get(async (req, res) => {
    let currentUser = req.session.user;
    let boardId = req.params.boardId;
    let boardGet; 
    let sortOrder;
    try{
      boardGet = await boardData.getBoardById(boardId);
    }catch(e){
      res.status(401).render("../views/error", {err: e.message});
    }
    if(boardGet.owner !== currentUser.username){
      res.status(403).render("../views/error", {err: `Only the board owner can access the board settings.`});
    }
    let flag;
    if(boardGet.priorityScheduling == "false"){
      flag=true;
      res.status(200).render("../views/boardSettings", {titley: "Board Settings",  sortBool:flag, sort:boardGet.sortOrder, name:boardGet.boardName, boardId: boardId  })
    }else{
      flag = false;
      res.status(200).render("../views/boardSettings", {titley: "Board Settings",  sortBool:flag, name:boardGet.boardName, boardId: boardId  })
    }
  })
  .post(async (req, res) => {
    let boardId = req.params.boardId;
    let board;
    try{
      board = await boardData.getBoardById(boardId);
    }catch{
      res.status(401).render("../views/error", {err: `Board with that ID does not exist`});
    }
    let name = xss(req.body.boardNameInput);
    let sortOrder, flag;
    if(board.priorityScheduling == "false"){
      sortOrder = req.body.sortOrderInput;
      flag = true;
    }else{
      sortOrder = "null";
      flag = false;
    }
    let password = xss(req.body.boardPasswordInput);
    let confirm = xss(req.body.confirmBoardPasswordInput);
    try{
      //console.log(boardId, name, sortOrder, password);
      validation.parameterCheck(boardId, name, sortOrder, password);
      validation.strValidCheck(boardId, name, sortOrder, password);
      boardId = validation.idCheck(boardId);
      if(name.length > 30){
        throw `Board Name must be less than 30 characters.`;
      }
      // if(sortOrder !== 'asc' && sortOrder !== 'desc'){
      //   throw `Sort Order must be equal to asc or desc.`;
      // }
      //board = await boardData.getBoardById(boardId);
    helpers.checkPassword(password);
    if(password !== confirm){
      throw `Password and confirm password must match`
    }
    
    }catch(e){
      return res.status(200).render("../views/boardSettings", {titley: "Board Settings",sortBool:flag , sort:board.sortOrder, name:board.boardName, boardId: boardId, error:true, e:e.message});
    }
    try{
      let updatedBoard = boardData.updateBoard(boardId, name, sortOrder, password);
      res.redirect("/boards/"+boardId);
    }catch(e){
      return res.status(200).render("../views/boardSettings", {titley: "Board Settings",sortBool:flag , sort:board.sortOrder, name:board.boardName, boardId: boardId, error:true, e:e.message});
    }
  })
  
router.route("/delete/:boardId")
  .get()
  .post(async (req,res) => {
    let boardId = req.params.boardId;
    let board;
    try{
      board = boardData.getBoardById(boardId);
    }catch(e){
      return res.status(200).render("../views/error", {titley: "Board Settings",  err: `No board with that ID`});
    }
    try{
    validation.parameterCheck(boardId);
    validation.strValidCheck(boardId);
    boardId = validation.idCheck(boardId);
    }catch(e){
      return res.status(200).render("../views/boardSettings", {titley: "Board Settings", error:true, e:e.message});
    }
    try{
      let data = boardData.deleteBoard(boardId);
      res.redirect("/homepage");
    }catch{
      return res.status(200).render("../views/boardSettings", {titley: "Board Settings",  sort:board.sortOrder, name:board.boardName, boardId: boardId, error:true, e:e.message});
    }
  })

export default router;