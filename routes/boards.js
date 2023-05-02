//import axios from "axios";
import { Router } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData} from "../data/index.js";
import {userData} from "../data/index.js";


router.route("/:id")
  .get( async (req, res) => {
    console.log("I got here");
    let boardId1;
    let userGet;
    let boardT;
    let boardS;
    let b1;
    try {
      console.log("I got in here");
      boardId1 = req.params.id;
      userGet = await boardData.getBoardById(boardId1);
      console.log("I got in here2");
      console.log(userGet);
      boardT = userGet.toDo;
      boardS = userGet.inProgress;

      //boardy2 = userGet.toDo
      //console.log(userget.toDo)
    } catch (e) {
      return res.render("error", { titley:"Error page", err: e });
    }
    try {
        res.render("boards", { titley: "Board page", boardName:boardT});
      } catch (e) {
        res.status(500).json({ error: e });
      }

  });

export default router;

