import {Router} from 'express';
const router = Router();
//add whatever imports you need

import {boardData, checkListData} from "../data/index.js";

router.route('/')
  .get( async (req, res) => {
    let userBoards = undefined;
    let userChecklist = undefined;
    let myBoards = undefined;
    let myChecklist = undefined;
   // let username = req.body.username;
   let username = "tom_smith";
    try {
      userBoards = await boardData.getBoardsByUser(username);
      userChecklist = await checkListData.getCheckListByUsername(username);

     // console.log(userBoards)
     // myBoards = JSON.stringify(userBoards);
     // myChecklist = JSON.stringify(userChecklist);
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e });
    }
    let boardNames = [];
    for (let board in userBoards) {
      boardNames.push(board.boardName);
    }

   // console.log

    try {
        res.render("homepage", { titley: "Homepage", user: username, userBoards: userBoards, checklist: userChecklist});
      } catch (e) {
        res.status(500).json({ error: e });
      }

  });

export default router;