//import axios from "axios";
import { Router } from "express";
const router = Router();
import {boards} from "../config/mongoCollections.js";

import {boardData} from "../data/index.js";

router

router.route('/').get(async (req, res) => {
    //code here for GET
    try{
      res.render('homepage', {titley: "Homepage"});
    }
    catch{
      res.status(500).json({error: e});
    }
    
  });
router.route("/boards")
  .get( async (req, res) => {
    console.log("I got here");
    let userName;
    let userGet;
    let boardy;
    try {
      userName = 'user1'
      userGet = await boardData.getBoardsByUser(userName);
      console.log(userGet)
      boardy = JSON.stringify(userGet);
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

