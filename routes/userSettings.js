import {Router} from 'express';
const router = Router();
import validation from "../utils/validation.js"
import helpers from "../data/helpers.js"
import boardData from '../data/boards.js'
import userData from '../data/users.js'
import {ObjectId} from 'mongodb';

router.route("/")
  .get(async (req,res) => {
    let currentUser = req.session.user;
    return res.status(200).render("../views/userSettings", {titley: "User Settings", error:false, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
  })
  .post(async (req, res)=> {
    const currentUser = req.session.user;
    

    let email = req.body.emailAddressInput;
    let password = req.body.passwordInput;
    let first = req.body.firstNameInput;
    let last = req.body.lastNameInput;
    let user = req.body.usernameInput;
    let confirm = req.body.confirmPasswordInput;
    let dob = req.body.dobInput;
    try{
      validation.parameterCheck(email, password, dob, confirm, user, first, last)
    }catch(e){
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      validation.strValidCheck(email, password, dob, confirm, user, first, last)
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      first = helpers.checkName(first);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      last = helpers.checkName(last);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    dob = dob.trim();
    let year = dob.substring(0,4); let month=dob.substring(5,7); let day=dob.substring(8);
    dob=month+"/"+day+"/"+year;
    try{
      validation.validDateCheck(dob);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      helpers.checkAge(dob);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      email = helpers.checkEmail(email);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      user = helpers.checkUsername(user);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    try{
      helpers.checkPassword(password);
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
    
    let id = currentUser["_id"];
    id = id.toString();
    try{
      await userData.updateUser(id,first,last,dob,email,user,password);
      req.session.user = await userData.getUserById(id);
      return res.status(200).redirect("/homepage");
    }catch(e){
      //render settings page with error
      return res.status(200).render("../views/userSettings", {titley: "User Settings", error:true, e:e.message, first:currentUser.firstName, last:currentUser.lastName, email:currentUser.email, dob:new Date(currentUser.dob), user:currentUser.username});
    }
  });


export default router;