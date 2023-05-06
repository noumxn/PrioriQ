import {Router} from 'express';
const router = Router();
import userData from '../data/users.js'
import helpers from "../data/helpers.js"
import validation from '../utils/validation.js';
import xss from 'xss';

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/register')
  .get(async (req, res) => {
    res.status(200).render("../views/register", {titley: "register", error:false});
  })
  .post(async (req, res) => {
    let email = xss(req.body.emailAddressInput);
    let password = xss(req.body.passwordInput);
    let first = xss(req.body.firstNameInput);
    let last = xss(req.body.lastNameInput);
    let user = xss(req.body.usernameInput);
    let confirm = xss(req.body.confirmPasswordInput);
    let dob = xss(req.body.dobInput);
    if(email === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"Email is missing a value"});
    }
    if(password === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"Password is missing a value"});
    }
    if(first === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"First name is missing a value"});
    }
    if(last === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"Last name is missing a value"});
    }
    if(user === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"User is missing a value"});
    }
    if(confirm === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"Confirm Password is missing a value"});
    }
    if(dob === null){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:"Confirm Password is missing a value"});
    }
    let year = dob.substring(0,4); let month=dob.substring(5,7); let day=dob.substring(8);
    first = first.trim(); last = last.trim(); email = email.trim().toLowerCase(); password = password.trim(); confirm = confirm.trim();
    user = user.trim().toLowerCase(); dob=month+"/"+day+"/"+year;
    try{
      first = helpers.checkName(first);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      last = helpers.checkName(last);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      helpers.checkAge(dob);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      email = helpers.checkEmail(email);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      user = helpers.checkUsername(user);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      helpers.checkPassword(password);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      await helpers.checkUsernameUnique(user);
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message})
    }
    try{
      await userData.createUser(first, last, dob, email, user, password);
      return res.redirect("/login");
    }catch(e){
      return res.status(400).render("../views/register", {titley: "register",error:true, e:e.message});
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    return res.status(200).render("../views/login", {titley:"Login", error:false});
  })
  .post(async (req, res) => {
    let user = xss(req.body.usernameInput);
    let password = xss(req.body.passwordInput);
    if(user === null){
      return res.status(400).render("../views/login", {titley: "Login",error:true, e:"User is missing a value"});
    }
    if(password === null){
      return res.status(400).render("../views/login", {titley: "Login",error:true, e:"Password is missing a value"});
    }
    try{
      validation.strValidCheck(user, password);
    }catch(e){
      return res.status(400).render("../views/login", {titley: "Login", error:true, e:"Make sure user and password are valid inputs"});
    }
    try{
      user = helpers.checkUsername(user);
    }catch{
      return res.status(400).render("../views/login", {titley: "Login", error:true, e:e.message});
    }
    try{
      helpers.checkPassword(password);
    }catch{
      return res.status(400).render("../views/login", {titley: "Login", error:true, e:e.message});
    }
    try{
      req.session.user = await userData.authenticateUser(user, password);
      return res.status(200).redirect("/homepage");
    }catch(e){
      return res.status(400).render("../views/login", {titley: "Login",error:true, e:e.message});
    }
  });

  router.route('/error').get(async (req, res) => {
    return res.status(403).render("../views/error", {titley: "Error"});
  });
  
  router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    return res.status(200).render("../views/logout", {titley: "Logout"});
  });

  export default router;