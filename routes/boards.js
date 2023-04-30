//import axios from "axios";
import { Router } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData} from "../data/index.js";
import {userData} from "../data/index.js";


router.route("/boards")
  .get( async (req, res) => {
    console.log("I got here");
    let boardId1;
    let userGet;
    let boardy;
    let b1;
    try {
      console.log("I got in here");
      boardId1 = '644eca3a93b403198e0a9b3d';
      userGet = await boardData.getBoardById(boardId1);
      console.log("I got in here2");
      console.log(userGet);
      boardy = userGet.toDo
      //console.log(userget.toDo)
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e });
    }
    try {
        res.render("boards", { titley: "Board page", boardName:boardy});
      } catch (e) {
        res.status(500).json({ error: e });
      }

  });

export default router;

